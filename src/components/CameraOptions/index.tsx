import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';

import { useTheme } from '../../styles/theme';
import Icon from '../Icon';

import { styles } from './styles';

interface CameraOptionsProps {
  disabled?: boolean;
  flipCamera: () => void;
  switchFlash?: () => void;
}

const CameraOptions: React.FC<CameraOptionsProps> = ({
  disabled = false,
  flipCamera,
  switchFlash,
}) => {
  const [flashState, setFlashState] = useState<boolean>(false);
  const theme = useTheme();
  const dynamicStyles = styles(theme);

  const handleSwitchFlash = (): void => {
    setFlashState(!flashState);
    if (switchFlash) {
      switchFlash();
    }
  };

  return (
    <View style={dynamicStyles.container}>
      <TouchableOpacity
        onPress={flipCamera}
        style={dynamicStyles.button}
        accessibilityRole='button'
        accessibilityLabel='Flip camera'
        accessibilityHint='Switch between front and back camera'
        disabled={disabled}
      >
        <Icon name='refresh-ccw' size={24} color='#FFFFFF' />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleSwitchFlash}
        style={dynamicStyles.button}
        accessibilityRole='button'
        accessibilityLabel={flashState ? 'Turn flash off' : 'Turn flash on'}
        accessibilityHint='Toggle camera flash'
        disabled={disabled}
      >
        <Icon name={flashState ? 'zap' : 'zap-off'} size={24} color='#FFFFFF' />
      </TouchableOpacity>

      <TouchableOpacity
        style={dynamicStyles.button}
        accessibilityRole='button'
        accessibilityLabel='Video mode'
        accessibilityHint='Switch to video recording mode'
        disabled={disabled}
      >
        <Icon name='video' size={24} color='#FFFFFF' />
      </TouchableOpacity>

      <TouchableOpacity
        style={dynamicStyles.button}
        accessibilityRole='button'
        accessibilityLabel='Music mode'
        accessibilityHint='Add music to your snap'
        disabled={disabled}
      >
        <Icon name='music' size={24} color='#FFFFFF' />
      </TouchableOpacity>

      <TouchableOpacity
        style={dynamicStyles.button}
        accessibilityRole='button'
        accessibilityLabel='Night mode'
        accessibilityHint='Toggle night mode for low light photos'
        disabled={disabled}
      >
        <Icon name='moon' size={24} color='#FFFFFF' />
      </TouchableOpacity>
    </View>
  );
};

export default CameraOptions;
