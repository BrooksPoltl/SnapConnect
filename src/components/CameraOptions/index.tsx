import React from 'react';
import { View, TouchableOpacity } from 'react-native';

import { Icon } from '../';
import { useTheme } from '../../styles/theme';
import { styles as createStyles } from './styles';

interface CameraOptionsProps {
  flipCamera: () => void;
  onToggleFlash: () => void;
  isFlashEnabled: boolean;
  disabled?: boolean;
}

const CameraOptions: React.FC<CameraOptionsProps> = ({
  flipCamera,
  onToggleFlash,
  isFlashEnabled,
  disabled,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  // Mock handlers for options that are not yet implemented
  const handleNotImplemented = () => {
    // TODO: Implement these features
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.optionButton, disabled && styles.disabledButton]}
        onPress={flipCamera}
        disabled={disabled}
        accessibilityRole='button'
        accessibilityLabel='Flip camera'
      >
        <Icon name='refresh-ccw' size={24} color={theme.colors.white} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.optionButton, disabled && styles.disabledButton]}
        onPress={onToggleFlash}
        disabled={disabled}
        accessibilityRole='button'
        accessibilityLabel='Toggle flash'
      >
        <Icon name={isFlashEnabled ? 'zap' : 'zap-off'} size={24} color={theme.colors.white} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.optionButton, disabled && styles.disabledButton]}
        onPress={handleNotImplemented}
        disabled={disabled}
        accessibilityRole='button'
        accessibilityLabel='Select video mode'
      >
        <Icon name='video' size={24} color={theme.colors.white} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.optionButton, disabled && styles.disabledButton]}
        onPress={handleNotImplemented}
        disabled={disabled}
        accessibilityRole='button'
        accessibilityLabel='Select music'
      >
        <Icon name='music' size={24} color={theme.colors.white} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.optionButton, disabled && styles.disabledButton]}
        onPress={handleNotImplemented}
        disabled={disabled}
        accessibilityRole='button'
        accessibilityLabel='Toggle night mode'
      >
        <Icon name='moon' size={24} color={theme.colors.white} />
      </TouchableOpacity>
    </View>
  );
};

export default CameraOptions;
