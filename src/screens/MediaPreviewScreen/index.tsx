import React, { useState, useRef } from 'react';
import { View, Image, TouchableOpacity, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { Video, ResizeMode } from 'expo-av';
import * as MediaLibrary from 'expo-media-library';
import { shareAsync } from 'expo-sharing';

import { useTheme } from '../../styles/theme';
import Icon from '../../components/Icon';
import { UserStackParamList } from '../../types/navigation';
import { logger, logError } from '../../utils/logger';

import { styles } from './styles';

type MediaPreviewScreenRouteProp = RouteProp<UserStackParamList, 'MediaPreview'>;

/**
 * MediaPreviewScreen displays captured photos and videos with preview controls
 * Features:
 * - Photo display with Image component
 * - Video playback with expo-av Video component
 * - Discard, Save, and Next action buttons
 * - Mute/unmute toggle for videos
 */
const MediaPreviewScreen: React.FC = () => {
  const route = useRoute<MediaPreviewScreenRouteProp>();
  const navigation = useNavigation();
  const { media } = route.params;

  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<Video>(null);

  const theme = useTheme();
  const dynamicStyles = styles(theme);

  React.useEffect(() => {
    logger.log('[MediaPreviewScreen] Screen mounted with media:', media);
  }, [media]);

  const handleDiscard = () => {
    logger.log('[MediaPreviewScreen] Discard button pressed');
    navigation.goBack();
  };

  const handleSave = async () => {
    try {
      logger.log('[MediaPreviewScreen] Save button pressed. Saving media to gallery...');

      const permission = await MediaLibrary.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Required', 'Permission to access media library is required!');
        return;
      }

      await MediaLibrary.saveToLibraryAsync(media.uri);
      logger.log('[MediaPreviewScreen] Media saved successfully.');
      Alert.alert('Success', `${media.type === 'photo' ? 'Photo' : 'Video'} saved to gallery!`);
    } catch (error) {
      logError('MediaPreviewScreen', 'Error saving media', error);
      Alert.alert('Save Error', `Failed to save ${media.type}`);
    }
  };

  const handleNext = async () => {
    try {
      logger.log('[MediaPreviewScreen] Next button pressed. Sharing media...');

      // For now, share the media. In the future, this could navigate to editing or posting screen
      await shareAsync(media.uri);
      logger.log('[MediaPreviewScreen] Media shared successfully.');
      navigation.goBack();
    } catch (error) {
      logError('MediaPreviewScreen', 'Error sharing media', error);
      Alert.alert('Share Error', `Failed to share ${media.type}`);
    }
  };

  const toggleMute = () => {
    const newMuteState = !isMuted;
    logger.log(
      `[MediaPreviewScreen] Toggling mute. New state: ${newMuteState ? 'Muted' : 'Unmuted'}`,
    );
    setIsMuted(newMuteState);
    if (videoRef.current) {
      videoRef.current.setIsMutedAsync(newMuteState);
    }
  };

  const renderMedia = () => {
    if (media.type === 'photo') {
      return <Image source={{ uri: media.uri }} style={dynamicStyles.media} resizeMode='contain' />;
    } else {
      return (
        <View style={dynamicStyles.videoContainer}>
          <Video
            ref={videoRef}
            source={{ uri: media.uri }}
            style={dynamicStyles.media}
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay
            isLooping
            isMuted={isMuted}
            useNativeControls={false}
          />

          {/* Mute/Unmute button for videos */}
          <TouchableOpacity
            style={dynamicStyles.muteButton}
            onPress={toggleMute}
            accessibilityRole='button'
            accessibilityLabel={isMuted ? 'Unmute video' : 'Mute video'}
          >
            <Icon name={isMuted ? 'volume-x' : 'volume-2'} size={24} color={theme.colors.white} />
          </TouchableOpacity>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={dynamicStyles.container}>
      {/* Media display */}
      <View style={dynamicStyles.mediaContainer}>{renderMedia()}</View>

      {/* Action buttons */}
      <View style={dynamicStyles.actionsContainer}>
        <TouchableOpacity
          style={[dynamicStyles.actionButton, dynamicStyles.discardButton]}
          onPress={handleDiscard}
          accessibilityRole='button'
          accessibilityLabel='Discard media'
          accessibilityHint='Go back to camera without saving'
        >
          <Icon name='x' size={20} color={theme.colors.white} />
          <Text style={dynamicStyles.actionButtonText}>Discard</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[dynamicStyles.actionButton, dynamicStyles.saveButton]}
          onPress={handleSave}
          accessibilityRole='button'
          accessibilityLabel='Save media'
          accessibilityHint='Save to device gallery'
        >
          <Icon name='download' size={20} color={theme.colors.white} />
          <Text style={dynamicStyles.actionButtonText}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[dynamicStyles.actionButton, dynamicStyles.nextButton]}
          onPress={handleNext}
          accessibilityRole='button'
          accessibilityLabel='Continue'
          accessibilityHint='Proceed to share or edit'
        >
          <Icon name='arrow-right' size={20} color={theme.colors.white} />
          <Text style={dynamicStyles.actionButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default MediaPreviewScreen;
