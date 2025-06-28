import React, { useRef } from 'react';
import {
  Animated,
  Pressable,
  PressableProps,
  ViewStyle,
  GestureResponderEvent,
} from 'react-native';

interface AnimatedPressableProps extends PressableProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  scaleValue?: number;
  animationDuration?: number;
  hapticFeedback?: boolean;
}

/**
 * Enhanced pressable component with smooth scale animations
 * Provides tactile feedback and smooth micro-interactions
 * @param children - Child components to render
 * @param style - Additional styles to apply
 * @param scaleValue - Scale factor when pressed (default: 0.95)
 * @param animationDuration - Animation duration in ms (default: 150)
 * @param hapticFeedback - Whether to provide haptic feedback (default: true)
 */
const AnimatedPressable: React.FC<AnimatedPressableProps> = ({
  children,
  style,
  scaleValue = 0.95,
  animationDuration = 150,
  onPressIn,
  onPressOut,
  ...pressableProps
}) => {
  // Theme can be used for future customizations
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = (event: GestureResponderEvent) => {
    Animated.timing(scaleAnim, {
      toValue: scaleValue,
      duration: animationDuration,
      useNativeDriver: true,
    }).start();

    onPressIn?.(event);
  };

  const handlePressOut = (event: GestureResponderEvent) => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();

    onPressOut?.(event);
  };

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} {...pressableProps}>
      <Animated.View
        style={[
          style,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
};

export default AnimatedPressable;
