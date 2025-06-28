import React, { useEffect, useRef } from 'react';
import { Animated, View, ViewStyle, StyleSheet } from 'react-native';

import { useTheme } from '../../styles/theme';

interface AnimatedCardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  delay?: number;
  duration?: number;
  elevation?: 'small' | 'medium' | 'large';
  gradient?: boolean;
  enterFromDirection?: 'bottom' | 'top' | 'left' | 'right' | 'fade';
}

/**
 * Animated card component with entrance animations and beautiful shadows
 * Perfect for content cards, profile cards, and feature highlights
 * @param children - Child components to render inside the card
 * @param style - Additional styles to apply
 * @param delay - Animation delay in ms (default: 0)
 * @param duration - Animation duration in ms (default: 600)
 * @param elevation - Shadow elevation level (default: 'medium')
 * @param gradient - Whether to apply gradient background (default: false)
 * @param enterFromDirection - Direction of entrance animation (default: 'bottom')
 */
const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  style,
  delay = 0,
  duration = 600,
  elevation = 'medium',
  gradient = false,
  enterFromDirection = 'bottom',
}) => {
  const theme = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    const animateIn = () => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration,
          delay,
          useNativeDriver: true,
        }),
        Animated.spring(translateAnim, {
          toValue: 0,
          tension: 100,
          friction: 8,
          delay,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          delay,
          useNativeDriver: true,
        }),
      ]).start();
    };

    animateIn();
  }, [fadeAnim, translateAnim, scaleAnim, delay, duration]);

  const getTransform = () => {
    switch (enterFromDirection) {
      case 'top':
        return [
          {
            translateY: translateAnim.interpolate({
              inputRange: [0, 50],
              outputRange: [0, -50],
            }),
          },
          { scale: scaleAnim },
        ];
      case 'left':
        return [
          {
            translateX: translateAnim.interpolate({
              inputRange: [0, 50],
              outputRange: [0, -50],
            }),
          },
          { scale: scaleAnim },
        ];
      case 'right':
        return [{ translateX: translateAnim }, { scale: scaleAnim }];
      case 'fade':
        return [{ scale: scaleAnim }];
      default: // bottom
        return [{ translateY: translateAnim }, { scale: scaleAnim }];
    }
  };

  const elevationStyles = {
    small: {
      shadowColor: theme.colors.cardShadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: theme.colors.cardShadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    large: {
      shadowColor: theme.colors.cardShadow,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  };

  const cardStyle: ViewStyle = {
    backgroundColor: gradient ? theme.colors.surfaceHighlight : theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...elevationStyles[elevation],
  };

  const gradientAccentStyle = StyleSheet.create({
    accent: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 2,
      backgroundColor: theme.colors.primary,
      borderTopLeftRadius: theme.borderRadius.lg,
      borderTopRightRadius: theme.borderRadius.lg,
    },
  });

  return (
    <Animated.View
      style={[
        cardStyle,
        {
          opacity: fadeAnim,
          transform: getTransform(),
        },
        style,
      ]}
    >
      {gradient && <View style={gradientAccentStyle.accent} />}
      {children}
    </Animated.View>
  );
};

export default AnimatedCard;
