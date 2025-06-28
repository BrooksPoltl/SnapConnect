import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';

import { useTheme } from '../../styles/theme';

interface PulseAnimationProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  duration?: number;
  minScale?: number;
  maxScale?: number;
  minOpacity?: number;
  maxOpacity?: number;
  pulseColor?: string;
  enabled?: boolean;
}

/**
 * Pulse animation component for highlighting important elements
 * Creates a subtle breathing effect that draws attention
 * @param children - Child components to render
 * @param style - Additional styles to apply
 * @param duration - Pulse duration in ms (default: 2000)
 * @param minScale - Minimum scale value (default: 1)
 * @param maxScale - Maximum scale value (default: 1.05)
 * @param minOpacity - Minimum opacity value (default: 0.7)
 * @param maxOpacity - Maximum opacity value (default: 1)
 * @param pulseColor - Color for the pulse effect (default: primary)
 * @param enabled - Whether the pulse animation is active (default: true)
 */
const PulseAnimation: React.FC<PulseAnimationProps> = ({
  children,
  style,
  duration = 2000,
  minScale = 1,
  maxScale = 1.05,
  minOpacity = 0.7,
  maxOpacity = 1,
  pulseColor,
  enabled = true,
}) => {
  const theme = useTheme();
  const scaleAnim = useRef(new Animated.Value(minScale)).current;
  const opacityAnim = useRef(new Animated.Value(maxOpacity)).current;

  useEffect(() => {
    if (!enabled) {
      // Reset to default values when disabled
      scaleAnim.setValue(minScale);
      opacityAnim.setValue(maxOpacity);
      return;
    }

    const createPulseAnimation = () =>
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: maxScale,
            duration: duration / 2,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: minScale,
            duration: duration / 2,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: minOpacity,
            duration: duration / 2,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: maxOpacity,
            duration: duration / 2,
            useNativeDriver: true,
          }),
        ]),
      ]);

    const runPulseLoop = () => {
      createPulseAnimation().start(() => {
        if (enabled) {
          runPulseLoop();
        }
      });
    };

    runPulseLoop();
  }, [enabled, duration, maxScale, minScale, maxOpacity, minOpacity, scaleAnim, opacityAnim]);

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
        pulseColor && {
          backgroundColor: pulseColor,
          borderRadius: theme.borderRadius.md,
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
};

export default PulseAnimation;
