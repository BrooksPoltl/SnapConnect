import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';

interface FadeInAnimationProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  delay?: number;
  duration?: number;
  startOpacity?: number;
  endOpacity?: number;
  translateY?: number;
  enabled?: boolean;
}

/**
 * Smooth fade-in animation component
 * Perfect for content reveals and page transitions
 * @param children - Child components to render
 * @param style - Additional styles to apply
 * @param delay - Animation delay in ms (default: 0)
 * @param duration - Animation duration in ms (default: 400)
 * @param startOpacity - Starting opacity value (default: 0)
 * @param endOpacity - Ending opacity value (default: 1)
 * @param translateY - Y-axis translation distance (default: 20)
 * @param enabled - Whether the animation should run (default: true)
 */
const FadeInAnimation: React.FC<FadeInAnimationProps> = ({
  children,
  style,
  delay = 0,
  duration = 400,
  startOpacity = 0,
  endOpacity = 1,
  translateY = 20,
  enabled = true,
}) => {
  const fadeAnim = useRef(new Animated.Value(startOpacity)).current;
  const translateAnim = useRef(new Animated.Value(translateY)).current;

  useEffect(() => {
    if (!enabled) {
      fadeAnim.setValue(endOpacity);
      translateAnim.setValue(0);
      return;
    }

    const animateIn = () => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: endOpacity,
          duration,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(translateAnim, {
          toValue: 0,
          duration,
          delay,
          useNativeDriver: true,
        }),
      ]).start();
    };

    animateIn();
  }, [enabled, delay, duration, startOpacity, endOpacity, translateY, fadeAnim, translateAnim]);

  return (
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
          transform: [{ translateY: translateAnim }],
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
};

export default FadeInAnimation;
