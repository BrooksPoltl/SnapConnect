import React, { useState, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
  Modal,
  Pressable,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  Image as RNImage,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Video, ResizeMode } from 'expo-av';
import * as MediaLibrary from 'expo-media-library';
import { Skia, SkImage, useFonts } from '@shopify/react-native-skia';
import * as FileSystem from 'expo-file-system';

import { useTheme } from '../../styles/theme';
import Icon from '../../components/Icon';
import { UserStackParamList } from '../../types/navigation';
import { logError } from '../../utils/logger';
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
 * - Captioning for photos using Skia
 */
const MediaPreviewScreen: React.FC = () => {
  const route = useRoute<MediaPreviewScreenRouteProp>();
  const navigation = useNavigation<StackNavigationProp<UserStackParamList>>();
  const { media: originalMedia } = route.params;
  const { user } = useAuthentication();

  const [media] = useState(originalMedia);
  const [isMuted, setIsMuted] = useState(false);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(false);
  const videoRef = useRef<Video>(null);

  const [isPrivacyModalVisible, setPrivacyModalVisible] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [caption, setCaption] = useState('');
  const [isCaptioning, setIsCaptioning] = useState(false);
  const [skiaImage, setSkiaImage] = useState<SkImage | null>(null);

  const theme = useTheme();
  const dynamicStyles = styles(theme);

  // Load system fonts using useFonts hook
  const fontMgr = useFonts({
    System: [], // This will load the system font
  });

  React.useEffect(() => {
    checkMediaLibraryPermission();
  }, [media]);

  // Load image for Skia rendering
  React.useEffect(() => {
    const loadSkiaImage = async () => {
      if (media.type === 'photo') {
        try {
          // Read the file as base64
          const base64Data = await FileSystem.readAsStringAsync(media.uri, {
            encoding: FileSystem.EncodingType.Base64,
          });

          // Create Skia image from base64 data
          const data = Skia.Data.fromBase64(base64Data);
          const image = Skia.Image.MakeImageFromEncoded(data);

          if (image) {
            setSkiaImage(image);
          }
        } catch (error) {
          logError('MediaPreviewScreen', 'Error loading Skia image', error);
        }
      }
    };

    loadSkiaImage();
  }, [media.uri, media.type]);

  const checkMediaLibraryPermission = async () => {
    try {
      const permission = await MediaLibrary.getPermissionsAsync();
      setHasMediaLibraryPermission(permission.granted);
    } catch (error) {
      logError('MediaPreviewScreen', 'Error checking media library permission', error);
    }
  };

  const handleDiscard = () => {
    navigation.goBack();
  };

  const handleSave = async () => {
    try {
      const permission = await MediaLibrary.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Required', 'Permission to access media library is required!');
        return;
      }

      await MediaLibrary.saveToLibraryAsync(media.uri);
      Alert.alert('Success', `${media.type === 'photo' ? 'Photo' : 'Video'} saved to gallery!`);
    } catch (saveError) {
      logError('MediaPreviewScreen', 'Error saving media', saveError);
      Alert.alert('Save Error', `Failed to save ${media.type}`);
    }
  };

  const generateCaptionedImage = async () => {
    if (!caption) {
      return media.uri;
    }

    if (!skiaImage) {
      return media.uri;
    }

    try {
      // Create a surface to draw on
      const imageWidth = skiaImage.width();
      const imageHeight = skiaImage.height();

      // Create surface and canvas
      const surface = Skia.Surface.Make(imageWidth, imageHeight);
      if (!surface) {
        throw new Error('Failed to create Skia surface');
      }

      const canvas = surface.getCanvas();

      // Draw the original image
      canvas.drawImage(skiaImage, 0, 0);

      // Draw the caption using Paragraph API
      if (caption && fontMgr) {
        // Create paragraph with system font
        const paragraph = Skia.ParagraphBuilder.Make({}, fontMgr)
          .pushStyle({
            color: Skia.Color('white'),
            fontSize: 48,
            fontFamilies: ['System'], // Use system font
          })
          .addText(caption)
          .build();

        // Layout the paragraph
        const maxWidth = imageWidth - 100;
        paragraph.layout(maxWidth);

        // Get paragraph dimensions
        const paragraphHeight = paragraph.getHeight();
        const paragraphWidth = paragraph.getLongestLine();

        // Calculate position (bottom center)
        const textX = (imageWidth - paragraphWidth) / 2;
        const textY = imageHeight - paragraphHeight - 100;

        // Draw background rectangle
        const backgroundPaint = Skia.Paint();
        backgroundPaint.setColor(Skia.Color('rgba(0, 0, 0, 0.7)'));
        const backgroundRect = Skia.XYWHRect(
          textX - 20,
          textY - 20,
          paragraphWidth + 40,
          paragraphHeight + 40,
        );
        canvas.drawRect(backgroundRect, backgroundPaint);

        // Draw the paragraph using the correct method
        paragraph.paint(canvas, textX, textY);
      }

      // Create image from surface
      const image = surface.makeImageSnapshot();
      if (!image) {
        throw new Error('Failed to create image snapshot');
      }

      // Encode to base64
      const base64 = image.encodeToBase64();

      // Save to document directory (more reliable for file access)
      const fileName = `captioned-image-${Date.now()}.jpg`;
      const path = `${FileSystem.documentDirectory}${fileName}`;
      await FileSystem.writeAsStringAsync(path, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Verify the file was created successfully
      const fileInfo = await FileSystem.getInfoAsync(path);
      if (!fileInfo.exists) {
        throw new Error('Failed to create captioned image file');
      }

      return path;
    } catch (error) {
      logError('MediaPreviewScreen', 'Error generating captioned image', error);
      Alert.alert('Error', 'Could not apply caption. Please try again.');
      return media.uri;
    }
  };

  const handlePostStory = async (privacy: 'public' | 'private_friends') => {
    if (!user) return;

    setPrivacyModalVisible(false);
    setIsPosting(true);

    try {
      const mediaType = media.type === 'photo' ? 'image' : 'video';
      const finalMediaUri = media.type === 'photo' ? await generateCaptionedImage() : media.uri;

      await postStory(finalMediaUri, mediaType, privacy, user.id);
      navigation.navigate('Main', { screen: 'Stories' });
    } catch (postError) {
      Alert.alert('Error', 'Failed to post story. Please try again.');
      logError('MediaPreviewScreen', 'Error posting story', postError);
    } finally {
      setIsPosting(false);
    }
  };

  const handleSend = async () => {
    const finalMediaUri = media.type === 'photo' ? await generateCaptionedImage() : media.uri;
    const finalMedia = { ...media, uri: finalMediaUri };

    navigation.navigate('SelectRecipients', { media: finalMedia });
  };

  const toggleMute = () => {
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    if (videoRef.current) {
      videoRef.current.setIsMutedAsync(newMuteState);
    }
  };

  const renderMedia = () => {
    if (media.type === 'photo') {
      // Use React Native Image with caption overlay (no container here - it's handled by parent)
      return (
        <>
          <TouchableWithoutFeedback onPress={() => setIsCaptioning(true)}>
            <RNImage source={{ uri: media.uri }} style={dynamicStyles.media} resizeMode='contain' />
          </TouchableWithoutFeedback>
          {caption && (
            <View style={dynamicStyles.captionOverlay}>
              <Text style={dynamicStyles.captionText}>{caption}</Text>
            </View>
          )}
        </>
      );
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
      <Pressable onPress={Keyboard.dismiss} style={dynamicStyles.mediaContainer}>
        {renderMedia()}
      </Pressable>

      {isCaptioning && media.type === 'photo' && (
        <View style={dynamicStyles.captionContainer}>
          <TextInput
            style={dynamicStyles.captionInput}
            value={caption}
            onChangeText={setCaption}
            placeholder='Add a caption...'
            placeholderTextColor={theme.colors.textSecondary}
            autoFocus
            onBlur={() => setIsCaptioning(false)}
          />
        </View>
      )}

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
