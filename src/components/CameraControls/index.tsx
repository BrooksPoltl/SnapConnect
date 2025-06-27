import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

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
  cameraMode: 'picture' | 'video';
  onModeChange: (mode: 'picture' | 'video') => void;
}

const CameraControls: React.FC<CameraControlsProps> = ({
  isRecording,
  onTakePhoto,
  onStartRecording,
  onStopRecording,
  onCheckGallery,
  onFlipCamera,
  cameraMode,
  onModeChange,
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

      {/* Main Capture Section */}
      <View style={styles.captureSection}>
        {/* Main Capture Button */}
        <TouchableOpacity
          style={styles.captureButton}
          onPress={cameraMode === 'picture' ? onTakePhoto : onStartRecording}
          onPressOut={onStopRecording}
          delayLongPress={800}
          activeOpacity={0.8}
          accessibilityRole='button'
          accessibilityLabel='Take photo or start recording'
        >
          <View style={[styles.captureButtonInner, isRecording && styles.recordingButton]} />
        </TouchableOpacity>

        {/* Mode Toggle Buttons */}
        <View style={styles.modeToggle}>
          <TouchableOpacity
            style={[
              styles.modeButton,
              cameraMode === 'picture' && styles.activeModeButton,
              isRecording && styles.disabledButton,
            ]}
            onPress={() => onModeChange('picture')}
            disabled={isRecording}
          >
            <Text
              style={[
                styles.modeButtonText,
                cameraMode === 'picture' && styles.activeModeButtonText,
              ]}
            >
              PHOTO
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.modeButton,
              cameraMode === 'video' && styles.activeModeButton,
              isRecording && styles.disabledButton,
            ]}
            onPress={() => onModeChange('video')}
            disabled={isRecording}
          >
            <Text
              style={[styles.modeButtonText, cameraMode === 'video' && styles.activeModeButtonText]}
            >
              VIDEO
            </Text>
          </TouchableOpacity>
        </View>
      </View>

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
