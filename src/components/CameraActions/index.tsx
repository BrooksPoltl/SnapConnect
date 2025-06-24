import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';

import { useTheme } from '../../styles/theme';
import Icon from '../Icon';

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
            <Icon name='image' size={24} color='#FFFFFF' />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={takePhoto}
            style={dynamicStyles.captureButton}
            accessibilityRole='button'
            accessibilityLabel='Take photo'
            accessibilityHint='Tap to capture a photo'
          >
            <View style={dynamicStyles.captureButtonInner} />
          </TouchableOpacity>

          <TouchableOpacity
            style={dynamicStyles.actionButton}
            onPress={onSelfieToggle}
            accessibilityRole='button'
            accessibilityLabel='Switch camera'
            accessibilityHint='Tap to switch between front and back camera'
          >
            <Icon name='refresh-cw' size={24} color='#FFFFFF' />
          </TouchableOpacity>
        </View>
      </View>
    );
  },
);

CameraActions.displayName = 'CameraActions';

export default CameraActions;
