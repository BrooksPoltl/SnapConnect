/**
 * MediaViewerScreen
 *
 * A full-screen component to display a single photo or video.
 * It receives media details via route parameters and handles fetching
 * the signed URL from Supabase Storage for display.
 */
import React, { useEffect, useState } from 'react';
import { View, Image, ActivityIndicator, Pressable, Alert } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { supabase } from '../../services/supabase';
import { styles } from './styles';
import { logger } from '../../utils/logger';
import type { RootStackScreenProps } from '../../types/navigation';
import { useTheme } from '../../styles/theme';

export const MediaViewerScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RootStackScreenProps<'MediaViewer'>['route']>();
  const { storage_path, content_type } = route.params;
  const theme = useTheme();
  const dynamicStyles = styles(theme);

  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    /**
     * Fetches a signed URL for the media file from Supabase Storage.
     * The URL is temporary and secure.
     */
    async function getMediaUrl() {
      if (!storage_path) {
        Alert.alert('Error', 'No media path provided.');
        logger.error('MediaViewerScreen: No storage_path provided.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const { data, error } = await supabase.storage
          .from('media')
          .createSignedUrl(storage_path, 60); // URL is valid for 60 seconds

        if (error) {
          throw error;
        }

        setMediaUrl(data.signedUrl);
      } catch (error) {
        logger.error('Error getting signed URL for media:', {
          path: storage_path,
          error,
        });
        Alert.alert('Error', 'Could not load media. Please try again.');
        navigation.goBack();
      } finally {
        setIsLoading(false);
      }
    }

    getMediaUrl();
  }, [storage_path, navigation]);

  return (
    <View style={dynamicStyles.container}>
      <Pressable style={dynamicStyles.closeButton} onPress={() => navigation.goBack()}>
        <Ionicons name='close' size={32} color={theme.colors.white} />
      </Pressable>

      {isLoading ? (
        <ActivityIndicator size='large' color={theme.colors.white} />
      ) : content_type === 'image' && mediaUrl ? (
        <Image source={{ uri: mediaUrl }} style={dynamicStyles.media} resizeMode='contain' />
      ) : content_type === 'video' && mediaUrl ? (
        <Video
          source={{ uri: mediaUrl }}
          style={dynamicStyles.media}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          isLooping
          shouldPlay
        />
      ) : null}
    </View>
  );
};
