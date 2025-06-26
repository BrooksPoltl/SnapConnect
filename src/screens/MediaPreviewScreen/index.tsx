import React, { useState, useRef } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Video, ResizeMode } from 'expo-av';
import * as MediaLibrary from 'expo-media-library';

import { useTheme } from '../../styles/theme';
import Icon from '../../components/Icon';
import { UserStackParamList } from '../../types/navigation';
import { logger, logError } from '../../utils/logger';
import { useAuthentication } from '../../utils/hooks/useAuthentication';
import { postStory } from '../../services/stories';

import { styles } from './styles';

type MediaPreviewScreenRouteProp = RouteProp<UserStackParamList, 'MediaPreview'>;

/**
 * MediaPreviewScreen displays captured photos and videos with preview controls
 * Features:
 * - Photo display with Image component
 * - Video playback with expo-av Video component
 * - Save, Send, and Discard action buttons (consistent with PhotoPreview design)
 * - Mute/unmute toggle for videos
 */
const MediaPreviewScreen: React.FC = () => {
  const route = useRoute<MediaPreviewScreenRouteProp>();
  const navigation = useNavigation<StackNavigationProp<UserStackParamList>>();
  const { media } = route.params;
  const { user } = useAuthentication();

  const [isMuted, setIsMuted] = useState(false);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(false);
  const videoRef = useRef<Video>(null);
  const [isPrivacyModalVisible, setPrivacyModalVisible] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  const theme = useTheme();
  const dynamicStyles = styles(theme);

  React.useEffect(() => {
    logger.log('[MediaPreviewScreen] Screen mounted with media:', media);
    checkMediaLibraryPermission();
  }, [media]);

  const checkMediaLibraryPermission = async () => {
    try {
      const permission = await MediaLibrary.getPermissionsAsync();
      setHasMediaLibraryPermission(permission.granted);
    } catch (error) {
      logError('MediaPreviewScreen', 'Error checking media library permission', error);
    }
  };

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
    } catch (saveError) {
      logError('MediaPreviewScreen', 'Error saving media', saveError);
      Alert.alert('Save Error', `Failed to save ${media.type}`);
    }
  };

  const handlePostStory = async (privacy: 'public' | 'private_friends') => {
    if (!user) return;

    setPrivacyModalVisible(false);
    setIsPosting(true);

    try {
      const mediaType = media.type === 'photo' ? 'image' : 'video';
      await postStory(media.uri, mediaType, privacy, user.id);
      navigation.navigate('Main', { screen: 'Stories' });
    } catch (postError) {
      Alert.alert('Error', 'Failed to post story. Please try again.');
      logError('MediaPreviewScreen', 'Error posting story', postError);
    } finally {
      setIsPosting(false);
    }
  };

  const handleSend = () => {
    navigation.navigate('SelectRecipients', { media });
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

      {/* Action buttons - consistent with PhotoPreview design */}
      <View style={dynamicStyles.actionsContainer}>
        {hasMediaLibraryPermission && (
          <TouchableOpacity
            style={[dynamicStyles.actionButton, dynamicStyles.saveButton]}
            onPress={handleSave}
            accessibilityRole='button'
            accessibilityLabel='Save media'
            accessibilityHint='Save to device gallery'
          >
            <Icon
              name='download'
              size={16}
              color={theme.colors.text}
              style={dynamicStyles.buttonIcon}
            />
            <Text style={dynamicStyles.actionButtonText}>Save</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[dynamicStyles.actionButton, dynamicStyles.sendButton]}
          onPress={handleSend}
          accessibilityRole='button'
          accessibilityLabel='Send media'
          accessibilityHint='Send to a friend'
        >
          <Icon name='send' size={16} color={theme.colors.text} style={dynamicStyles.buttonIcon} />
          <Text style={dynamicStyles.actionButtonText}>Send</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[dynamicStyles.actionButton]}
          onPress={() => setPrivacyModalVisible(true)}
          disabled={isPosting}
        >
          <Icon
            name='plus-square'
            size={16}
            color={theme.colors.text}
            style={dynamicStyles.buttonIcon}
          />
          <Text style={dynamicStyles.actionButtonText}>Story</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[dynamicStyles.actionButton, dynamicStyles.discardButton]}
          onPress={handleDiscard}
          accessibilityRole='button'
          accessibilityLabel='Discard media'
          accessibilityHint='Delete and go back'
        >
          <Icon
            name='trash-2'
            size={16}
            color={theme.colors.text}
            style={dynamicStyles.buttonIcon}
          />
          <Text style={dynamicStyles.actionButtonText}>Discard</Text>
        </TouchableOpacity>
      </View>

      {isPosting && <ActivityIndicator size='large' color='#fff' style={dynamicStyles.loader} />}

      <Modal
        transparent={true}
        visible={isPrivacyModalVisible}
        onRequestClose={() => setPrivacyModalVisible(false)}
        animationType='slide'
      >
        <View style={dynamicStyles.modalContainer}>
          <View style={dynamicStyles.modalContent}>
            <Text style={dynamicStyles.modalTitle}>Who can see your story?</Text>
            <Pressable style={dynamicStyles.modalButton} onPress={() => handlePostStory('public')}>
              <Text style={dynamicStyles.modalButtonText}>Public</Text>
            </Pressable>
            <Pressable
              style={dynamicStyles.modalButton}
              onPress={() => handlePostStory('private_friends')}
            >
              <Text style={dynamicStyles.modalButtonText}>Friends Only</Text>
            </Pressable>
            <Pressable
              style={[dynamicStyles.modalButton, dynamicStyles.cancelButton]}
              onPress={() => setPrivacyModalVisible(false)}
            >
              <Text style={dynamicStyles.modalButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Pressable style={dynamicStyles.closeButton} onPress={() => navigation.goBack()}>
        <Icon name='x' size={32} color='white' />
      </Pressable>
    </SafeAreaView>
  );
};

export default MediaPreviewScreen;
