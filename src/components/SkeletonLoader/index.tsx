import React, { useEffect, useRef } from 'react';
import { View, Animated, ViewStyle, DimensionValue } from 'react-native';

import { useTheme } from '../../styles/theme';

import { styles } from './styles';

interface SkeletonLoaderProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: ViewStyle | ViewStyle[];
  shimmerColors?: string[];
  duration?: number;
}

/**
 * Base skeleton loader component with shimmer animation
 * Provides a shimmering placeholder effect while content loads
 *
 * @param width - Width of the skeleton (default: '100%')
 * @param height - Height of the skeleton (default: 20)
 * @param borderRadius - Border radius (default: theme borderRadius)
 * @param style - Additional styling
 * @param shimmerColors - Custom shimmer gradient colors
 * @param duration - Animation duration in ms (default: 1500)
 */
const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = 20,
  borderRadius,
  style,
  shimmerColors,
  duration = 1500,
}) => {
  const theme = useTheme();
  const dynamicStyles = styles(theme);
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  // Default shimmer colors based on theme
  const defaultShimmerColors = [
    theme.colors.border,
    theme.colors.surface,
    theme.colors.surfaceHighlight,
    theme.colors.surface,
    theme.colors.border,
  ];

  const colors = shimmerColors ?? defaultShimmerColors;

  useEffect(() => {
    const animateShimmer = () => {
      shimmerAnim.setValue(0);
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration,
        useNativeDriver: false, // Required for gradient animations
      }).start(() => {
        // Loop the animation
        setTimeout(animateShimmer, 100);
      });
    };

    animateShimmer();
  }, [shimmerAnim, duration]);

  // Create gradient effect using animated opacity
  const shimmerOpacity = shimmerAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 1, 0.3],
    extrapolate: 'clamp',
  });

  const shimmerTranslateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 100],
    extrapolate: 'clamp',
  });

  const skeletonStyle: ViewStyle = {
    width,
    height,
    borderRadius: borderRadius ?? theme.borderRadius.sm,
    backgroundColor: colors[0],
    overflow: 'hidden',
  };

  return (
    <View style={[skeletonStyle, style]}>
      <Animated.View
        style={[
          dynamicStyles.shimmer,
          {
            opacity: shimmerOpacity,
            transform: [{ translateX: shimmerTranslateX }],
            backgroundColor: colors[2], // Highlight color
          },
        ]}
      />
    </View>
  );
};

export default SkeletonLoader;
