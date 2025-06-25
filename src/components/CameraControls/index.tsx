import React from 'react';
import { View, TouchableOpacity } from 'react-native';

import { Icon } from '../';
import { useTheme } from '../../styles/theme';
import { styles as createStyles } from './styles';

interface CameraControlsProps {
  isRecording: boolean;
  onTakePhoto: () => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onCheckGallery: () => void;
  onFlipCamera: () => void;
}

const CameraControls: React.FC<CameraControlsProps> = ({
  isRecording,
  onTakePhoto,
  onStartRecording,
  onStopRecording,
  onCheckGallery,
  onFlipCamera,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      {/* Gallery Button */}
      <TouchableOpacity
        style={[styles.sideButton, isRecording && styles.disabledButton]}
        onPress={onCheckGallery}
        disabled={isRecording}
        accessibilityRole='button'
        accessibilityLabel='Open gallery'
      >
        <Icon
          name='image'
          size={28}
          color={isRecording ? theme.colors.textSecondary : theme.colors.white}
        />
      </TouchableOpacity>

      {/* Main Capture Button */}
      <TouchableOpacity
        style={styles.captureButton}
        onPress={onTakePhoto}
        onLongPress={onStartRecording}
        onPressOut={onStopRecording}
        activeOpacity={0.8}
        accessibilityRole='button'
        accessibilityLabel='Take photo or start recording'
      >
        <View style={[styles.captureButtonInner, isRecording && styles.recordingButton]} />
      </TouchableOpacity>

      {/* Flip Camera Button */}
      <TouchableOpacity
        style={[styles.sideButton, isRecording && styles.disabledButton]}
        onPress={onFlipCamera}
        disabled={isRecording}
        accessibilityRole='button'
        accessibilityLabel='Flip camera'
      >
        <Icon
          name='refresh-cw'
          size={28}
          color={isRecording ? theme.colors.textSecondary : theme.colors.white}
        />
      </TouchableOpacity>
    </View>
  );
};

export default CameraControls;
