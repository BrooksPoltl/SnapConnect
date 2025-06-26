import React, { useState, useEffect, useCallback } from 'react';
import { View, Image, Text, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Video, ResizeMode } from 'expo-av';
import { UserStackParamList, Story } from '../../types';
import { styles as stylesFunction } from './styles';
import { supabase } from '../../services/supabase';
import { markStoryViewed } from '../../services/stories';
import { useTheme } from '../../styles/theme';
import { logError } from '../../utils/logger';

type StoryViewerRouteProp = RouteProp<UserStackParamList, 'StoryViewer'>;

export const StoryViewerScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<StoryViewerRouteProp>();
  const theme = useTheme();
  const dynamicStyles = stylesFunction(theme);

  const { stories, username } = route.params;
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const currentStory = stories?.[currentStoryIndex];

  const fetchMediaUrl = useCallback(
    async (story: Story | undefined) => {
      if (!story) return;
      setIsLoading(true);
      setMediaUrl(null);
      try {
        const { data } = await supabase.storage
          .from('media')
          .createSignedUrl(story.storage_path, 60 * 5);

        if (!data?.signedUrl) {
          throw new Error('Failed to create signed URL');
        }
        setMediaUrl(data.signedUrl);
      } catch (error) {
        logError('StoryViewerScreen', 'Error fetching story media URL', {
          error,
          story,
        });
        navigation.goBack();
      } finally {
        setIsLoading(false);
      }
    },
    [navigation],
  );

  useEffect(() => {
    if (currentStory) {
      fetchMediaUrl(currentStory);
      if (!currentStory.is_viewed) {
        markStoryViewed(currentStory.id);
      }
    }
  }, [currentStory, fetchMediaUrl]);

  const handleNextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else {
      navigation.goBack();
    }
  };

  const handlePreviousStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    }
  };

  if (!currentStory) {
    return (
      <View style={dynamicStyles.container}>
        <Text style={dynamicStyles.errorText}>Story not available.</Text>
        <Pressable onPress={() => navigation.goBack()} style={dynamicStyles.closeButton}>
          <Text style={dynamicStyles.closeButtonText}>Close</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={dynamicStyles.container}>
      <View style={dynamicStyles.header}>
        <View style={dynamicStyles.progressBarContainer}>
          {stories.map((_, index) => (
            <View
              key={index}
              style={[
                dynamicStyles.progressBar,
                index <= currentStoryIndex
                  ? dynamicStyles.progressBarActive
                  : dynamicStyles.progressBarInactive,
              ]}
            />
          ))}
        </View>
        <View style={dynamicStyles.userInfo}>
          <Text style={dynamicStyles.username}>{username}</Text>
          <Pressable onPress={() => navigation.goBack()} style={dynamicStyles.closeButton}>
            <Text style={dynamicStyles.closeButtonText}>X</Text>
          </Pressable>
        </View>
      </View>

      {isLoading || !mediaUrl ? (
        <ActivityIndicator size='large' color={theme.colors.white} />
      ) : currentStory.media_type === 'image' ? (
        <Image source={{ uri: mediaUrl }} style={dynamicStyles.media} resizeMode='contain' />
      ) : (
        <Video
          source={{ uri: mediaUrl }}
          style={dynamicStyles.media}
          shouldPlay
          isLooping={false}
          isMuted={false}
          resizeMode={ResizeMode.CONTAIN}
          onPlaybackStatusUpdate={status => {
            if ('didJustFinish' in status && status.didJustFinish) {
              handleNextStory();
            }
          }}
        />
      )}
      <View style={StyleSheet.absoluteFillObject} pointerEvents='box-none'>
        <Pressable
          style={[dynamicStyles.prevNextArea, dynamicStyles.prevArea]}
          onPress={handlePreviousStory}
        />
        <Pressable
          style={[dynamicStyles.prevNextArea, dynamicStyles.nextArea]}
          onPress={handleNextStory}
        />
      </View>
    </View>
  );
};
