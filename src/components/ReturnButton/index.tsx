import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

import { useTheme } from '../../styles/theme';

import { styles } from './styles';

interface ReturnButtonProps {
  navigation: StackNavigationProp<Record<string, object | undefined>>;
  returnName: string;
}

const ReturnButton: React.FC<ReturnButtonProps> = ({ navigation, returnName }) => {
  const theme = useTheme();
  const dynamicStyles = styles(theme);

  const handlePress = () => {
    if (navigation && navigation.navigate) {
      navigation.navigate(returnName);
    }
  };

  return (
    <View style={dynamicStyles.container}>
      <TouchableOpacity
        style={dynamicStyles.button}
        onPress={handlePress}
        accessibilityRole='button'
        accessibilityLabel='Go back'
        accessibilityHint={`Navigate back to ${returnName}`}
      >
        <Text style={dynamicStyles.buttonText}>{'<'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ReturnButton;
