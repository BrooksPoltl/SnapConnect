import React, { useEffect, useRef, useState } from 'react';
import { Text, View, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, CameraType, CameraCapturedPicture } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { shareAsync } from 'expo-sharing';
import * as ImagePicker from 'expo-image-picker';

import { useTheme } from '../../styles/theme';
import CameraActions from '../../components/CameraActions';
import CameraOptions from '../../components/CameraOptions';
// Utils
import { logger, logError } from '../../utils/logger';

import { styles } from './styles';

interface CameraScreenProps {
  navigation?: {
    goBack?: () => void;
  };
  focused?: boolean;
}

const CameraScreen: React.FC<CameraScreenProps> = ({
  navigation: _navigation,
  focused: _focused,
}) => {
  const cameraRef = useRef<Camera>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | undefined>();
  const [type, setType] = useState<CameraType>(CameraType.back);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState<boolean | undefined>();
  const [photo, setPhoto] = useState<CameraCapturedPicture | undefined>();

  const theme = useTheme();
  const dynamicStyles = styles(theme);

  useEffect(() => {
    (async () => {
      try {
        const cameraPermission = await Camera.requestCameraPermissionsAsync();
        const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
        setHasCameraPermission(cameraPermission.status === 'granted');
        setHasMediaLibraryPermission(mediaLibraryPermission.status === 'granted');
      } catch (error) {
        logError('CameraScreen', 'Error requesting permissions', error);
        Alert.alert('Permission Error', 'Failed to request camera permissions');
      }
    })();
  }, []);

  const flipCamera = (): void => {
    setType(type === CameraType.back ? CameraType.front : CameraType.back);
  };

  const checkGallery = async (): Promise<void> => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera roll is required!');
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!pickerResult.canceled) {
        logger.log('Selected image:', pickerResult.assets[0]);
      }
    } catch (error) {
      logError('CameraScreen', 'Error accessing gallery', error);
      Alert.alert('Gallery Error', 'Failed to access gallery');
    }
  };

  const takePhoto = async (): Promise<void> => {
    try {
      logger.log('Taking photo...');
      const options = {
        quality: 1,
        base64: true,
        exif: false,
      };

      if (cameraRef.current) {
        const newPhoto = await cameraRef.current.takePictureAsync(options);
        setPhoto(newPhoto);
      }
    } catch (error) {
      logError('CameraScreen', 'Error taking photo', error);
      Alert.alert('Camera Error', 'Failed to take photo');
    }
  };

  const savePhoto = (): void => {
    if (photo && hasMediaLibraryPermission) {
      MediaLibrary.saveToLibraryAsync(photo.uri)
        .then(() => {
          setPhoto(undefined);
          Alert.alert('Success', 'Photo saved to gallery!');
        })
        .catch(error => {
          logError('CameraScreen', 'Error saving photo', error);
          Alert.alert('Save Error', 'Failed to save photo');
        });
    }
  };

  const sharePhoto = () => {
    if (photo) {
      shareAsync(photo.uri)
        .then(() => {
          setPhoto(undefined);
        })
        .catch(error => {
          logError('CameraScreen', 'Error sharing photo', error);
          Alert.alert('Share Error', 'Failed to share photo');
        });
    }
  };

  const discardPhoto = () => {
    setPhoto(undefined);
  };

  // Permission loading state
  if (hasCameraPermission === undefined) {
    return (
      <SafeAreaView style={dynamicStyles.container}>
        <View style={dynamicStyles.messageContainer}>
          <Text style={dynamicStyles.messageText}>Requesting camera permissions...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Permission denied state
  if (!hasCameraPermission) {
    return (
      <SafeAreaView style={dynamicStyles.container}>
        <View style={dynamicStyles.messageContainer}>
          <Text style={dynamicStyles.messageText}>
            Camera permission not granted. Please enable camera access in your device settings.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Photo preview mode
  if (photo) {
    return (
      <SafeAreaView style={dynamicStyles.container}>
        <Image
          style={dynamicStyles.preview}
          source={{ uri: `data:image/jpg;base64,${photo.base64}` }}
        />
        <View style={dynamicStyles.photoActions}>
          {hasMediaLibraryPermission && (
            <TouchableOpacity
              style={[dynamicStyles.actionButton, dynamicStyles.saveButton]}
              onPress={savePhoto}
              accessibilityRole='button'
              accessibilityLabel='Save photo'
            >
              <Text style={dynamicStyles.actionButtonText}>Save</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[dynamicStyles.actionButton, dynamicStyles.shareButton]}
            onPress={sharePhoto}
            accessibilityRole='button'
            accessibilityLabel='Share photo'
          >
            <Text style={dynamicStyles.actionButtonText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[dynamicStyles.actionButton, dynamicStyles.discardButton]}
            onPress={discardPhoto}
            accessibilityRole='button'
            accessibilityLabel='Discard photo'
          >
            <Text style={dynamicStyles.actionButtonText}>Discard</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Camera mode
  return (
    <View style={dynamicStyles.cameraContainer}>
      <Camera style={dynamicStyles.camera} type={type} ref={cameraRef} />
      <CameraOptions flipCamera={flipCamera} />
      <CameraActions checkGallery={checkGallery} takePhoto={takePhoto} />
    </View>
  );
};

export default CameraScreen;
