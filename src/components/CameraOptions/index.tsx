import React from 'react';
import { View, TouchableOpacity } from 'react-native';

import { Icon } from '../';
import { useTheme } from '../../styles/theme';
import { styles as createStyles } from './styles';

interface CameraOptionsProps {
  onToggleFlash: () => void;
  onToggleTorch: () => void;
  flashMode: 'off' | 'on';
  isTorchEnabled: boolean;
  disabled?: boolean;
  topOffset?: number;
}

/**
 * Camera options component providing flash, torch, maybe other options in the future
 * Features:
 * - Flash mode toggle (off/on)
 * - Torch/flashlight toggle
 */
const CameraOptions: React.FC<CameraOptionsProps> = ({
  onToggleFlash,
  onToggleTorch,
  flashMode,
  isTorchEnabled,
  disabled,
  topOffset = 0,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const getFlashIcon = () => (flashMode === 'on' ? 'zap' : 'zap-off');

  const getFlashIconColor = () => (flashMode === 'on' ? theme.colors.primary : theme.colors.white);

  return (
    <View style={[styles.container, { top: 80 + topOffset }]}>
      {/* Flash Mode Button */}
      <TouchableOpacity
        style={[styles.optionButton, disabled && styles.disabledButton]}
        onPress={onToggleFlash}
        disabled={disabled}
        accessibilityRole='button'
        accessibilityLabel={`Flash mode: ${flashMode}`}
      >
        <Icon name={getFlashIcon()} size={24} color={getFlashIconColor()} />
      </TouchableOpacity>

      {/* Torch/Light Button */}
      <TouchableOpacity
        style={[styles.optionButton, disabled && styles.disabledButton]}
        onPress={onToggleTorch}
        disabled={disabled}
        accessibilityRole='button'
        accessibilityLabel={isTorchEnabled ? 'Turn off torch' : 'Turn on torch'}
      >
        <Icon
          name='sun'
          size={24}
          color={isTorchEnabled ? theme.colors.primary : theme.colors.white}
        />
      </TouchableOpacity>
    </View>
  );
};

export default CameraOptions;
