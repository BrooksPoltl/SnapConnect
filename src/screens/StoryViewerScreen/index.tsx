import React, { useState, useEffect } from 'react';
import { View, Image, Text, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Video, ResizeMode } from 'expo-av';
import { UserStackParamList } from '../../types';
import { styles } from './styles';
import { getSignedMediaUrl } from '../../services/media';
import { logger } from '../../utils/logger';

type StoryViewerRouteProp = RouteProp<UserStackParamList, 'StoryViewer'>;

export const StoryViewerScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<StoryViewerRouteProp>();

  const { stories, username } = route.params;
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // For V1, we only show the first story.
  const currentStory = stories?.[0];

  useEffect(() => {
    if (!currentStory) {
      Alert.alert('Error', 'Story not available.');
      logger.error('StoryViewerScreen: No currentStory found.');
      navigation.goBack();
      return;
    }

    const fetchMediaUrl = async () => {
      try {
        setIsLoading(true);
        const url = await getSignedMediaUrl(currentStory.storage_path);
        setMediaUrl(url);
      } catch (error) {
        logger.error('Error fetching story media URL:', { story: currentStory, error });
        Alert.alert('Error', 'Could not load story. Please try again.');
        navigation.goBack();
      } finally {
        setIsLoading(false);
      }
    };

    fetchMediaUrl();
  }, [currentStory, navigation]);

  if (!currentStory) {
    // This will be briefly rendered before the useEffect triggers navigation.goBack()
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Story not available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with username and close button */}
      <View style={styles.header}>
        <Text style={styles.username}>{username}</Text>
        <Pressable onPress={() => navigation.goBack()} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>X</Text>
        </Pressable>
      </View>

      {/* Media Content */}
      {isLoading ? (
        <ActivityIndicator size='large' color='#fff' />
      ) : currentStory.media_type === 'image' && mediaUrl ? (
        <Image source={{ uri: mediaUrl }} style={styles.media} resizeMode='contain' />
      ) : currentStory.media_type === 'video' && mediaUrl ? (
        <Video
          source={{ uri: mediaUrl }}
          style={styles.media}
          shouldPlay
          isLooping
          isMuted
          resizeMode={ResizeMode.CONTAIN}
        />
      ) : null}
    </View>
  );
};
