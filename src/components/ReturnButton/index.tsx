import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

import { useTheme } from '../../styles/theme';
import Icon from '../Icon';

import { styles } from './styles';

interface ReturnButtonProps {
  navigation: StackNavigationProp<Record<string, object | undefined>>;
  returnName: string;
}

const ReturnButton: React.FC<ReturnButtonProps> = ({ navigation, returnName }) => {
  const theme = useTheme();
  const dynamicStyles = styles(theme);

  const handlePress = () => {
    navigation.navigate(returnName);
  };

  return (
    <View style={dynamicStyles.container}>
      <TouchableOpacity
        onPress={handlePress}
        style={dynamicStyles.button}
        accessibilityRole='button'
        accessibilityLabel='Go back'
        accessibilityHint={`Return to ${returnName} screen`}
      >
        <Icon name='arrow-left' size={24} color='text' />
      </TouchableOpacity>
    </View>
  );
};

export default ReturnButton;
