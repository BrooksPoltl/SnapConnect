import React, { useState, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
  Modal,
  Pressable,
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
import { DrawingCanvas, DrawingToolbar, Icon } from '../../components';
import { UserStackParamList } from '../../types/navigation';
import { logError } from '../../utils/logger';
import { useAuthentication } from '../../utils/hooks/useAuthentication';
import { useTheme } from '../../styles/theme';
import { postStory } from '../../services/stories';
import { generatePhotoCaption } from '../../services/ai';
import { uploadMediaFile } from '../../services/media';
import { PathWithColor } from '../../components/DrawingCanvas/types';

import FormField from '../../components/FormField';

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
  const videoRef = useRef<Video>(null);

  const [isPrivacyModalVisible, setPrivacyModalVisible] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [caption, setCaption] = useState('');
  const [isCaptioning, setIsCaptioning] = useState(false);
  const [skiaImage, setSkiaImage] = useState<SkImage | null>(null);
  const [isGeneratingCaption, setIsGeneratingCaption] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [paths, setPaths] = useState<PathWithColor[]>([]);
  const [color, setColor] = useState('#FFFFFF');
  const [isLoading, setIsLoading] = useState(false);

  const theme = useTheme();
  const dynamicStyles = styles(theme);

  // Load system fonts using useFonts hook
  const fontMgr = useFonts({
    System: [], // This will load the system font
  });

  React.useEffect(() => {
    // Load image for Skia rendering when media changes
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

  const handleGenerateCaption = async () => {
    setIsGeneratingCaption(true);
    try {
      const base64Data = await FileSystem.readAsStringAsync(media.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const fullBase64 = `data:image/jpeg;base64,${base64Data}`;
      const generatedCaption = await generatePhotoCaption(fullBase64);

      if (generatedCaption) {
        setCaption(generatedCaption);
      }
    } catch (error) {
      logError('MediaPreviewScreen', 'Error generating AI caption', error);
      Alert.alert('Error', 'Failed to generate AI caption.');
    } finally {
      setIsGeneratingCaption(false);
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
    setIsLoading(true);
    try {
      // For now, just send the original media without drawing capture
      // Drawing functionality will work for display but won't be captured in the final image
      const finalUri = media.type === 'photo' ? await generateCaptionedImage() : media.uri;

      const fileInfo = await FileSystem.getInfoAsync(finalUri);
      if (!fileInfo.exists) {
        throw new Error('File does not exist');
      }

      const fileType = media.type === 'video' ? 'video/mp4' : 'image/jpeg';
      const fileName = finalUri.split('/').pop() ?? `media_${Date.now()}`;

      await uploadMediaFile({
        uri: finalUri,
        type: fileType,
        name: fileName,
      });

      navigation.goBack();
    } catch (error) {
      logError('Error sending media', (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUndo = () => {
    setPaths(currentPaths => currentPaths.slice(0, -1));
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
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <Pressable onPress={Keyboard.dismiss} style={dynamicStyles.mediaContainer}>
        {renderMedia()}
        <DrawingCanvas
          paths={paths}
          setPaths={setPaths}
          color={color}
          strokeWidth={4}
          isEnabled={isDrawing}
        />
      </Pressable>

      <View style={dynamicStyles.topControls}>
        <TouchableOpacity onPress={handleDiscard} style={dynamicStyles.controlButton}>
          <Icon name='x' size={32} color='white' enable3D={true} shadowColor='rgba(0, 0, 0, 0.8)' />
        </TouchableOpacity>

        {media.type === 'video' && (
          <TouchableOpacity
            onPress={toggleMute}
            style={dynamicStyles.controlButton}
            accessibilityRole='button'
            accessibilityLabel={isMuted ? 'Unmute video' : 'Mute video'}
          >
            <Icon
              name={isMuted ? 'volume-x' : 'volume-2'}
              size={24}
              color='white'
              enable3D={true}
              shadowColor='rgba(0, 0, 0, 0.8)'
            />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={() => setIsDrawing(!isDrawing)}
          style={dynamicStyles.controlButton}
        >
          <Icon
            name='edit-3'
            size={30}
            color={isDrawing ? 'cyan' : 'white'}
            backgroundContainer={isDrawing}
            containerColor={isDrawing ? '#00FFFF' : undefined}
            enable3D={true}
            shadowColor={isDrawing ? '#00FFFF' : 'rgba(0, 0, 0, 0.8)'}
          />
        </TouchableOpacity>
      </View>

      {media.type === 'photo' && (
        <>
          {isCaptioning ? (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={dynamicStyles.captionInputContainer}>
                <FormField
                  variant='inline'
                  value={caption}
                  onChangeText={setCaption}
                  placeholder='Type a caption...'
                  autoFocus
                  onSubmitEditing={() => setIsCaptioning(false)}
                  containerStyle={dynamicStyles.captionFieldContainer}
                />
              </View>
            </TouchableWithoutFeedback>
          ) : (
            <View style={dynamicStyles.captionContainer}>
              <TouchableOpacity
                onPress={() => setIsCaptioning(true)}
                style={dynamicStyles.captionDisplay}
              >
                <Text style={dynamicStyles.captionText}>{caption || 'Add a caption...'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleGenerateCaption}
                style={dynamicStyles.aiButton}
                disabled={isGeneratingCaption}
              >
                {isGeneratingCaption ? (
                  <ActivityIndicator color={theme.colors.primary} />
                ) : (
                  <Icon
                    name='zap'
                    size={24}
                    color={theme.colors.primary}
                    backgroundContainer={true}
                    containerColor={theme.colors.primary}
                    enable3D={true}
                    shadowColor={theme.colors.primary}
                  />
                )}
              </TouchableOpacity>
            </View>
          )}
        </>
      )}

      {isDrawing && (
        <DrawingToolbar onColorChange={setColor} onUndo={handleUndo} selectedColor={color} />
      )}

      <View style={dynamicStyles.bottomControls}>
        <TouchableOpacity onPress={handleSave} style={dynamicStyles.controlButton}>
          <Icon
            name='download'
            size={24}
            color='white'
            enable3D={true}
            shadowColor='rgba(0, 0, 0, 0.8)'
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setPrivacyModalVisible(true)}
          style={dynamicStyles.controlButton}
          disabled={isPosting}
        >
          <Icon
            name='plus-circle'
            size={24}
            color='white'
            enable3D={true}
            shadowColor='rgba(0, 0, 0, 0.8)'
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSend}
          style={dynamicStyles.sendButton}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color='white' />
          ) : (
            <Icon
              name='send'
              size={30}
              color='white'
              enable3D={true}
              shadowColor='rgba(0, 0, 0, 0.8)'
            />
          )}
        </TouchableOpacity>
      </View>

      <Modal
        animationType='slide'
        transparent={true}
        visible={isPrivacyModalVisible}
        onRequestClose={() => setPrivacyModalVisible(false)}
      >
        <View style={dynamicStyles.modalContainer}>
          <View style={dynamicStyles.modalContent}>
            <Text style={dynamicStyles.modalTitle}>Post to Story</Text>
            <TouchableOpacity
              style={dynamicStyles.modalButton}
              onPress={() => handlePostStory('public')}
            >
              <Text style={dynamicStyles.modalButtonText}>Public</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={dynamicStyles.modalButton}
              onPress={() => handlePostStory('private_friends')}
            >
              <Text style={dynamicStyles.modalButtonText}>Friends Only</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[dynamicStyles.modalButton, dynamicStyles.cancelButton]}
              onPress={() => setPrivacyModalVisible(false)}
            >
              <Text style={dynamicStyles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default MediaPreviewScreen;
