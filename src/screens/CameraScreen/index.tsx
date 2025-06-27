import React, { useEffect, useRef, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, CameraType, Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../styles/theme';
import { CameraControls, CameraOptions } from '../../components';
import { CapturedMedia } from '../../types/media';
import { UserStackParamList } from '../../types/navigation';
// Utils
import { logError, logger } from '../../utils/logger';

import { styles as createStyles } from './styles';

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
  const [flashMode, setFlashMode] = useState<'off' | 'on'>('off');
  const [isTorchEnabled, setIsTorchEnabled] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [cameraMode, setCameraMode] = useState<'picture' | 'video'>('picture');

  const theme = useTheme();
  const styles = createStyles(theme);

  /**
   * Toggles flash mode: off ↔ on
   */
  const onToggleFlash = () => {
    setFlashMode(current => {
      const newMode = current === 'off' ? 'on' : 'off';
      logger.log(`[CameraScreen] Flash mode changed: ${current} → ${newMode}`);
      return newMode;
    });
  };

  /**
   * Toggles torch/flashlight mode
   */
  const onToggleTorch = () => {
    setIsTorchEnabled(prev => {
      const newState = !prev;
      logger.log(`[CameraScreen] Torch toggled: ${prev} → ${newState}`);
      return newState;
    });
  };

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
      let hasMediaPermission = mediaPermission?.granted;
      if (!hasMediaPermission) {
        const mediaResult = await requestMediaPermission();
        hasMediaPermission = mediaResult.granted;
      }

      const pickerPermissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!hasMediaPermission && !pickerPermissionResult.granted) {
        Alert.alert(
          'Permission Required',
          'Please allow media library access to select photos and videos.',
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

  const startRecording = async (): Promise<void> => {
    logger.log('[CameraScreen] startRecording triggered.');
    setCameraMode('video');
    if (cameraRef.current && !isRecording && isCameraReady) {
      try {
        logger.log('[CameraScreen] Starting video recording...');
        setIsRecording(true);

        const video = await cameraRef.current.recordAsync({
          maxDuration: 300, // 5 minutes max
        });

        if (video?.uri) {
          const media: CapturedMedia = { uri: video.uri, type: 'video' };
          logger.log('Video recorded', video.uri);

          // Log the file extension to verify what format we got
          const fileExtension = video.uri.split('.').pop()?.toLowerCase();
          logger.log(`[CameraScreen] Recorded video extension: ${fileExtension}`);

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

  const stopRecording = () => {
    logger.log('[CameraScreen] stopRecording triggered.');
    if (cameraRef.current && isRecording) {
      logger.log('[CameraScreen] Calling native stopRecording().');
      cameraRef.current.stopRecording();
      setCameraMode('picture');
    }
  };

  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>Requesting permissions...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>
            We need your permission to access the camera and microphone.
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={async () => {
              const { status: camStatus } = await Camera.requestCameraPermissionsAsync();
              const { status: micStatus } = await Camera.requestMicrophonePermissionsAsync();
              setHasPermission(camStatus === 'granted' && micStatus === 'granted');
            }}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Debug current camera state
  logger.log(`[CameraScreen] Render - Flash: ${flashMode}, Torch: ${isTorchEnabled}`);

  return (
    <SafeAreaView style={styles.container}>
      {/* CameraView with NO children */}
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        onCameraReady={onCameraReady}
        mode={cameraMode}
        flash={flashMode}
        enableTorch={isTorchEnabled}
      />

      {/* All controls as absolutely positioned siblings */}
      <View style={styles.topControlsContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name='close-outline' size={32} color={theme.colors.white} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Friends')}
          style={styles.friendsButton}
        >
          <Ionicons name='people-outline' size={28} color={theme.colors.white} />
        </TouchableOpacity>
      </View>

      <CameraOptions
        flipCamera={flipCamera}
        disabled={isRecording}
        flashMode={flashMode}
        isTorchEnabled={isTorchEnabled}
        onToggleFlash={onToggleFlash}
        onToggleTorch={onToggleTorch}
      />

      <View style={styles.bottomControlsContainer}>
        <View style={styles.actionsContainer}>
          <CameraControls
            isRecording={isRecording}
            onTakePhoto={takePhoto}
            onStartRecording={startRecording}
            onStopRecording={stopRecording}
            onCheckGallery={checkGallery}
            onFlipCamera={flipCamera}
            cameraMode={cameraMode}
            onModeChange={setCameraMode}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CameraScreen;
