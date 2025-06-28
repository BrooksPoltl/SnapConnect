import React from 'react';
import { View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

import { useTheme } from '../../styles/theme';
import { Icon, AnimatedPressable } from '../';

import { styles } from './styles';

interface ReturnButtonProps {
  navigation: StackNavigationProp<Record<string, object | undefined>>;
  fallbackRoute?: string; // Optional fallback route if goBack() doesn't work
}

/**
 * Return button component for navigating back in the navigation stack
 * Uses goBack() by default, with optional fallback route
 */
const ReturnButton: React.FC<ReturnButtonProps> = ({ navigation, fallbackRoute }) => {
  const theme = useTheme();
  const dynamicStyles = styles(theme);

  const handlePress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else if (fallbackRoute) {
      navigation.navigate(fallbackRoute);
    }
  };

  return (
    <View style={dynamicStyles.container}>
      <AnimatedPressable
        onPress={handlePress}
        style={dynamicStyles.button}
        scaleValue={0.9}
        accessibilityRole='button'
        accessibilityLabel='Go back'
        accessibilityHint='Navigate to previous screen'
      >
        <Icon name='arrow-left' size={24} color='text' />
      </AnimatedPressable>
    </View>
  );
};

export default ReturnButton;
