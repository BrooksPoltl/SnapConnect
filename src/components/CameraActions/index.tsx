import React, { memo } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

import { useTheme } from '../../styles/theme';

import { styles } from './styles';

interface CameraActionsProps {
  checkGallery: () => void;
  takePhoto: () => void;
  onSelfieToggle?: () => void;
}

const CameraActions: React.FC<CameraActionsProps> = memo(
  ({ checkGallery, takePhoto, onSelfieToggle }) => {
    const theme = useTheme();
    const dynamicStyles = styles(theme);

    return (
      <View style={dynamicStyles.container}>
        <View style={dynamicStyles.buttonsContainer}>
          <TouchableOpacity
            onPress={checkGallery}
            style={dynamicStyles.actionButton}
            accessibilityRole='button'
            accessibilityLabel='Open gallery'
            accessibilityHint='Tap to select a photo from your gallery'
          >
            <Text style={dynamicStyles.icon}>📁</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={takePhoto}
            style={dynamicStyles.captureButton}
            accessibilityRole='button'
            accessibilityLabel='Take photo'
            accessibilityHint='Tap to capture a photo'
          >
            <Text style={dynamicStyles.captureIcon}>⭕</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={dynamicStyles.actionButton}
            onPress={onSelfieToggle}
            accessibilityRole='button'
            accessibilityLabel='Switch camera'
            accessibilityHint='Tap to switch between front and back camera'
          >
            <Text style={dynamicStyles.icon}>🔄</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  },
);

CameraActions.displayName = 'CameraActions';

export default CameraActions;
