import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

import { useTheme } from '../../styles/theme';

import { styles } from './styles';

interface CameraOptionsProps {
  flipCamera: () => void;
  switchFlash?: () => void;
}

const CameraOptions: React.FC<CameraOptionsProps> = ({ flipCamera, switchFlash }) => {
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
      >
        <Text style={dynamicStyles.icon}>🔄</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleSwitchFlash}
        style={dynamicStyles.button}
        accessibilityRole='button'
        accessibilityLabel={flashState ? 'Turn flash off' : 'Turn flash on'}
        accessibilityHint='Toggle camera flash'
      >
        <Text style={dynamicStyles.icon}>{flashState ? '⚡' : '🔦'}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={dynamicStyles.button}
        accessibilityRole='button'
        accessibilityLabel='Video mode'
        accessibilityHint='Switch to video recording mode'
      >
        <Text style={dynamicStyles.icon}>🎥</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={dynamicStyles.button}
        accessibilityRole='button'
        accessibilityLabel='Music mode'
        accessibilityHint='Add music to your snap'
      >
        <Text style={dynamicStyles.icon}>🎵</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={dynamicStyles.button}
        accessibilityRole='button'
        accessibilityLabel='Night mode'
        accessibilityHint='Toggle night mode for low light photos'
      >
        <Text style={dynamicStyles.icon}>🌙</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CameraOptions;
