import React, { useEffect, useRef, useState } from 'react';
import { Text, View, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, CameraType, Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../styles/theme';
import CameraOptions from '../../components/CameraOptions';
import { CapturedMedia } from '../../types/media';
import { UserStackParamList } from '../../types/navigation';
// Utils
import { logError, logger } from '../../utils/logger';

import { styles } from './styles';

interface CameraScreenProps {
  navigation?: {
    goBack?: () => void;
  };
  focused?: boolean;
}

/**
 * Camera screen with photo and video recording capabilities.
 * Implements a clean approach where recordAsync() resolves only after stopRecording() is called.
 */
const CameraScreen: React.FC<CameraScreenProps> = ({
  navigation: _navigation,
  focused: _focused,
}) => {
  const navigation = useNavigation<NavigationProp<UserStackParamList>>();
  const cameraRef = useRef<CameraView>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const theme = useTheme();
  const dynamicStyles = styles(theme);

  // Camera ready callback
  const onCameraReady = React.useCallback(() => {
    logger.log('[CameraScreen] onCameraReady callback fired.');
    setIsCameraReady(true);
  }, []);

  // Log state changes for debugging
  useEffect(() => {
    logger.log(`[CameraScreen] State Change: hasPermission = ${hasPermission}`);
  }, [hasPermission]);

  useEffect(() => {
    logger.log(`[CameraScreen] State Change: isRecording = ${isRecording}`);
  }, [isRecording]);

  useEffect(() => {
    logger.log(`[CameraScreen] State Change: isCameraReady = ${isCameraReady}`);
  }, [isCameraReady]);

  useEffect(() => {
    logger.log('[CameraScreen] Component did mount. Requesting permissions...');
    (async () => {
      try {
        logger.log('[CameraScreen] Requesting Camera permissions...');
        const { status: camStatus } = await Camera.requestCameraPermissionsAsync();
        logger.log(`[CameraScreen] Camera permission status: ${camStatus}`);

        logger.log('[CameraScreen] Requesting Microphone permissions...');
        const { status: micStatus } = await Camera.requestMicrophonePermissionsAsync();
        logger.log(`[CameraScreen] Microphone permission status: ${micStatus}`);

        const permissionGranted = camStatus === 'granted' && micStatus === 'granted';
        logger.log(`[CameraScreen] Permissions granted? ${permissionGranted}`);
        setHasPermission(permissionGranted);
      } catch (err) {
        logError('CameraScreen', 'Error requesting permissions', err);
        setHasPermission(false);
      }
    })();
  }, []);

  const flipCamera = (): void => {
    if (isRecording) return;
    logger.log('[CameraScreen] Flipping camera');
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const checkGallery = async (): Promise<void> => {
    if (isRecording) return;
    logger.log('[CameraScreen] Checking gallery');
    try {
      // Use more robust permission checking for gallery access
      // First try the media library permission
      let hasMediaPermission = mediaPermission?.granted;
      if (!hasMediaPermission) {
        const mediaResult = await requestMediaPermission();
        hasMediaPermission = mediaResult.granted;
      }

      // Also request image picker permission (sometimes needed separately in Expo Go)
      const pickerPermissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!hasMediaPermission && !pickerPermissionResult.granted) {
        Alert.alert(
          'Permission Required',
          'Please allow media library access to select photos and videos.\n\nGo to Settings > Expo Go > Photos and enable access.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Try Again', onPress: checkGallery },
          ],
        );
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!pickerResult.canceled && pickerResult.assets[0]) {
        const asset = pickerResult.assets[0];
        const media: CapturedMedia = {
          uri: asset.uri,
          type: asset.type === 'video' ? 'video' : 'photo',
          width: asset.width,
          height: asset.height,
          duration: asset.duration ?? undefined,
        };

        navigation.navigate('MediaPreview', { media });
      }
    } catch (error) {
      logError('CameraScreen', 'Error accessing gallery', error);
      Alert.alert('Gallery Error', 'Failed to access gallery. Please try again.');
    }
  };

  const takePhoto = async (): Promise<void> => {
    logger.log('[CameraScreen] takePhoto triggered.');
    if (isRecording || !cameraRef.current || !isCameraReady) {
      logger.warn(
        `[CameraScreen] takePhoto blocked: isRecording=${isRecording}, cameraRef=${!!cameraRef.current}, isCameraReady=${isCameraReady}`,
      );
      return;
    }

    try {
      logger.log('[CameraScreen] Taking photo...');
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
        base64: false,
        exif: false,
      });

      if (photo?.uri) {
        const media: CapturedMedia = {
          uri: photo.uri,
          type: 'photo',
          width: photo.width,
          height: photo.height,
        };
        navigation.navigate('MediaPreview', { media });
      }
    } catch (error) {
      logError('CameraScreen', 'Error taking photo', error);
      Alert.alert('Camera Error', 'Failed to take photo');
    }
  };

  /**
   * Starts an async video recording session on long press. The promise returned
   * by `recordAsync` resolves only after `stopRecording` is invoked.
   */
  const startRecording = async (): Promise<void> => {
    logger.log('[CameraScreen] startRecording triggered.');
    if (cameraRef.current && !isRecording && isCameraReady) {
      try {
        logger.log('[CameraScreen] Starting video recording...');
        setIsRecording(true);
        const video = await cameraRef.current.recordAsync();

        if (video?.uri) {
          const media: CapturedMedia = { uri: video.uri, type: 'video' };
          logger.log('Video recorded', video.uri);
          if (mediaPermission?.granted) {
            await MediaLibrary.saveToLibraryAsync(video.uri);
          }

          navigation.navigate('MediaPreview', { media });
        }
      } catch (error) {
        logError('CameraScreen', 'Video recording error', error);
        Alert.alert('Recording Error', 'Failed to record video.');
      } finally {
        logger.log('[CameraScreen] Recording process finished.');
        setIsRecording(false);
      }
    } else {
      logger.warn(
        `[CameraScreen] startRecording blocked: isRecording=${isRecording}, cameraRef=${!!cameraRef.current}, isCameraReady=${isCameraReady}`,
      );
    }
  };

  /**
   * Stops an active recording session when the capture button is released.
   */
  const stopRecording = () => {
    logger.log('[CameraScreen] stopRecording triggered.');
    if (cameraRef.current && isRecording) {
      logger.log('[CameraScreen] Calling native stopRecording().');
      cameraRef.current.stopRecording();
    }
  };

  // Permission loading state
  if (hasPermission === null) {
    logger.log('[CameraScreen] Rendering: Permission status is null. Waiting...');
    return (
      <SafeAreaView style={dynamicStyles.container}>
        <View style={dynamicStyles.messageContainer}>
          <Text style={dynamicStyles.messageText}>
            Requesting camera and microphone permissions...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Permission denied state
  if (hasPermission === false) {
    logger.log('[CameraScreen] Rendering: Permissions denied.');
    return (
      <SafeAreaView style={dynamicStyles.container}>
        <View style={dynamicStyles.messageContainer}>
          <Text style={dynamicStyles.messageText}>
            We need your permission to access the camera and microphone
          </Text>
          <TouchableOpacity
            style={dynamicStyles.permissionButton}
            onPress={() => {
              (async () => {
                try {
                  const { status: camStatus } = await Camera.requestCameraPermissionsAsync();
                  const { status: micStatus } = await Camera.requestMicrophonePermissionsAsync();
                  setHasPermission(camStatus === 'granted' && micStatus === 'granted');
                } catch (err) {
                  setHasPermission(false);
                }
              })();
            }}
            accessibilityRole='button'
            accessibilityLabel='Grant camera and microphone permission'
          >
            <Text style={dynamicStyles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Camera mode
  logger.log('[CameraScreen] Rendering: Camera view.');
  return (
    <View style={dynamicStyles.cameraContainer}>
      <CameraView
        style={dynamicStyles.camera}
        facing={facing}
        ref={cameraRef}
        onCameraReady={onCameraReady}
        // Let the camera handle mode switching automatically
      />

      <CameraOptions flipCamera={flipCamera} disabled={isRecording} />

      {/* --- Unified Capture Controls --- */}
      <View style={dynamicStyles.actionsContainer}>
        {/* Gallery Button */}
        <TouchableOpacity
          style={[dynamicStyles.sideButton, isRecording && dynamicStyles.disabledButton]}
          onPress={checkGallery}
          disabled={isRecording}
          accessibilityRole='button'
          accessibilityLabel='Open gallery'
        >
          <Ionicons
            name='images-outline'
            size={28}
            color={isRecording ? theme.colors.textSecondary : theme.colors.text}
          />
        </TouchableOpacity>

        {/* Main Capture Button */}
        <TouchableOpacity
          style={dynamicStyles.captureButton}
          onPress={takePhoto}
          onLongPress={startRecording}
          onPressOut={stopRecording}
          activeOpacity={0.8}
          accessibilityRole='button'
          accessibilityLabel='Take photo or start recording'
        >
          <View
            style={[dynamicStyles.captureButtonInner, isRecording && dynamicStyles.recordingButton]}
          />
        </TouchableOpacity>

        {/* Camera Flip Button */}
        <TouchableOpacity
          style={[dynamicStyles.sideButton, isRecording && dynamicStyles.disabledButton]}
          onPress={flipCamera}
          disabled={isRecording}
          accessibilityRole='button'
          accessibilityLabel='Flip camera'
        >
          <Ionicons
            name='camera-reverse-outline'
            size={28}
            color={isRecording ? theme.colors.textSecondary : theme.colors.text}
          />
        </TouchableOpacity>
      </View>
      {/* --- End of Unified Capture Controls --- */}
    </View>
  );
};

export default CameraScreen;
