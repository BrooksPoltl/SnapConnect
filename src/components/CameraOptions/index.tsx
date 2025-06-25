import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../styles/theme';
import { styles as createStyles } from './styles';

interface CameraOptionsProps {
  flipCamera: () => void;
  disabled?: boolean;
}

const CameraOptions: React.FC<CameraOptionsProps> = ({ flipCamera, disabled }) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.optionButton, disabled && styles.disabledButton]}
        onPress={flipCamera}
        disabled={disabled}
        accessibilityRole='button'
        accessibilityLabel='Flip camera'
      >
        <Ionicons
          name='camera-reverse-outline'
          size={28}
          color={disabled ? theme.colors.textSecondary : theme.colors.white}
        />
      </TouchableOpacity>
    </View>
  );
};

export default CameraOptions;
