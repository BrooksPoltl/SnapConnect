import React, { useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { CameraView, CameraType, CameraCapturedPicture, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { shareAsync } from 'expo-sharing';
import * as ImagePicker from 'expo-image-picker';

import { logger, logError } from '../logger';

interface UseCameraReturn {
  // Camera refs and state
  cameraRef: React.RefObject<CameraView | null>;
  permission: { granted: boolean } | null;
  requestPermission: () => void;
  hasMediaLibraryPermission: boolean | undefined;
  facing: CameraType;
  photo: CameraCapturedPicture | undefined;

  // Camera actions
  flipCamera: () => void;
  checkGallery: () => Promise<void>;
  takePhoto: () => Promise<void>;
  savePhoto: () => void;
  sharePhoto: () => void;
  discardPhoto: () => void;
}

/**
 * Custom hook for camera functionality
 * Extracts complex camera logic from components
 */
export const useCamera = (): UseCameraReturn => {
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState<boolean | undefined>();
  const [photo, setPhoto] = useState<CameraCapturedPicture | undefined>();

  useEffect(() => {
    const requestPermissions = async () => {
      try {
        const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
        setHasMediaLibraryPermission(mediaLibraryPermission.status === 'granted');
      } catch (error) {
        logError('useCamera', 'Error requesting permissions', error);
        Alert.alert('Permission Error', 'Failed to request camera permissions');
      }
    };

    requestPermissions();
  }, []);

  const flipCamera = (): void => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
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
      logError('useCamera', 'Error accessing gallery', error);
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
      logError('useCamera', 'Error taking photo', error);
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
          logError('useCamera', 'Error saving photo', error);
          Alert.alert('Save Error', 'Failed to save photo');
        });
    }
  };

  const sharePhoto = (): void => {
    if (photo) {
      shareAsync(photo.uri)
        .then(() => {
          setPhoto(undefined);
        })
        .catch(error => {
          logError('useCamera', 'Error sharing photo', error);
          Alert.alert('Share Error', 'Failed to share photo');
        });
    }
  };

  const discardPhoto = (): void => {
    setPhoto(undefined);
  };

  return {
    cameraRef,
    permission,
    requestPermission,
    hasMediaLibraryPermission,
    facing,
    photo,
    flipCamera,
    checkGallery,
    takePhoto,
    savePhoto,
    sharePhoto,
    discardPhoto,
  };
};
