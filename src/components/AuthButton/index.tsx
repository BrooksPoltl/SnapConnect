import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

import { useTheme } from '../../styles/theme';

import { styles } from './styles';

interface AuthButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}

/**
 * Reusable authentication button with loading state
 * Used across login and signup screens for consistent styling
 */
const AuthButton: React.FC<AuthButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
}) => {
  const theme = useTheme();
  const dynamicStyles = styles(theme);

  const isDisabled = loading || disabled;

  return (
    <TouchableOpacity
      style={[
        dynamicStyles.button,
        variant === 'secondary' && dynamicStyles.buttonSecondary,
        isDisabled && dynamicStyles.buttonDisabled,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole='button'
      accessibilityLabel={title}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? theme.colors.background : theme.colors.primary}
        />
      ) : (
        <Text
          style={[
            dynamicStyles.buttonText,
            variant === 'secondary' && dynamicStyles.buttonTextSecondary,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default AuthButton;
