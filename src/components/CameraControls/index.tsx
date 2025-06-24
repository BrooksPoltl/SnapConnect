import React from 'react';
import { View } from 'react-native';
import { CameraView, CameraType } from 'expo-camera';

import { useTheme } from '../../styles/theme';
import CameraActions from '../CameraActions';
import CameraOptions from '../CameraOptions';

import { styles } from './styles';

interface CameraControlsProps {
  cameraRef: React.RefObject<CameraView | null>;
  cameraType: CameraType;
  onTakePhoto: () => void;
  onFlipCamera: () => void;
  onCheckGallery: () => void;
}

/**
 * Component that renders the camera view with controls
 * Combines camera display with action buttons and options
 */
const CameraControls: React.FC<CameraControlsProps> = ({
  cameraRef,
  cameraType,
  onTakePhoto,
  onFlipCamera,
  onCheckGallery,
}) => {
  const theme = useTheme();
  const dynamicStyles = styles(theme);

  return (
    <View style={dynamicStyles.cameraContainer}>
      <CameraView style={dynamicStyles.camera} facing={cameraType} ref={cameraRef} />
      <CameraOptions flipCamera={onFlipCamera} />
      <CameraActions takePhoto={onTakePhoto} checkGallery={onCheckGallery} />
    </View>
  );
};

export default CameraControls;
