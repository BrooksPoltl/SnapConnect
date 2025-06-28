import React from 'react';
import { Text, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';

import { useTheme } from '../../styles/theme';
import { AnimatedPressable, PulseAnimation } from '../';

import { styles } from './styles';

interface AuthButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost' | 'success' | 'warning' | 'error';
  size?: 'small' | 'medium' | 'large';
  icon?: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  pulse?: boolean;
}

/**
 * Enhanced authentication button with smooth animations and loading state
 * Features scale animations, pulse effects, and improved visual hierarchy
 * @param title - Button text content
 * @param onPress - Button press handler
 * @param loading - Whether button is in loading state
 * @param disabled - Whether button is disabled
 * @param variant - Visual style variant
 * @param size - Button size variant
 * @param icon - Optional icon to display
 * @param style - Additional custom styles
 * @param pulse - Whether to show pulse animation
 */
const AuthButton: React.FC<AuthButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  size = 'medium',
  icon,
  style,
  pulse = false,
}) => {
  const theme = useTheme();
  const dynamicStyles = styles(theme);

  const isDisabled = loading || disabled;

  const getButtonStyle = (): ViewStyle[] => {
    const styleArray: ViewStyle[] = [dynamicStyles.button];

    // Variant styles
    switch (variant) {
      case 'secondary':
        styleArray.push(dynamicStyles.buttonSecondary);
        break;
      case 'ghost':
        styleArray.push(dynamicStyles.buttonGhost);
        break;
      case 'success':
        styleArray.push(dynamicStyles.buttonSuccess);
        break;
      case 'warning':
        styleArray.push(dynamicStyles.buttonWarning);
        break;
      case 'error':
        styleArray.push(dynamicStyles.buttonError);
        break;
      default:
        styleArray.push(dynamicStyles.buttonPrimary);
    }

    // Size styles
    switch (size) {
      case 'small':
        styleArray.push(dynamicStyles.buttonSmall);
        break;
      case 'large':
        styleArray.push(dynamicStyles.buttonLarge);
        break;
    }

    if (isDisabled) {
      styleArray.push(dynamicStyles.buttonDisabled);
    }

    return styleArray;
  };

  const getTextStyle = (): TextStyle[] => {
    const styleArray: TextStyle[] = [dynamicStyles.buttonText];

    switch (variant) {
      case 'secondary':
        styleArray.push(dynamicStyles.buttonTextSecondary);
        break;
      case 'ghost':
        styleArray.push(dynamicStyles.buttonTextGhost);
        break;
      case 'success':
        styleArray.push(dynamicStyles.buttonTextSuccess);
        break;
      case 'warning':
        styleArray.push(dynamicStyles.buttonTextWarning);
        break;
      case 'error':
        styleArray.push(dynamicStyles.buttonTextError);
        break;
      default:
        styleArray.push(dynamicStyles.buttonTextPrimary);
    }

    switch (size) {
      case 'small':
        styleArray.push(dynamicStyles.buttonTextSmall);
        break;
      case 'large':
        styleArray.push(dynamicStyles.buttonTextLarge);
        break;
    }

    return styleArray;
  };

  const getActivityIndicatorColor = () => {
    switch (variant) {
      case 'secondary':
      case 'ghost':
        return theme.colors.primary;
      case 'warning':
        return theme.colors.black;
      default:
        return theme.colors.white;
    }
  };

  const ButtonContent = (
    <AnimatedPressable
      style={[...getButtonStyle(), ...(Array.isArray(style) ? style : style ? [style] : [])]}
      onPress={onPress}
      disabled={isDisabled}
      scaleValue={0.96}
      animationDuration={120}
      accessibilityRole='button'
      accessibilityLabel={title}
    >
      {loading ? (
        <ActivityIndicator
          color={getActivityIndicatorColor()}
          size={size === 'large' ? 'large' : 'small'}
        />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text style={getTextStyle()}>{title}</Text>
        </>
      )}
    </AnimatedPressable>
  );

  if (pulse && !isDisabled && !loading) {
    return (
      <PulseAnimation duration={2000} minScale={1} maxScale={1.02} minOpacity={0.9} maxOpacity={1}>
        {ButtonContent}
      </PulseAnimation>
    );
  }

  return ButtonContent;
};

export default AuthButton;
