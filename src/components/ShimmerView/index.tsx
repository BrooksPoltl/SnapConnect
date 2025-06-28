import React, { useEffect, useRef } from 'react';
import { View, Animated, ViewStyle } from 'react-native';

import { useTheme } from '../../styles/theme';

interface ShimmerViewProps {
  children: React.ReactNode;
  isShimmering?: boolean;
  intensity?: 'subtle' | 'medium' | 'strong';
  direction?: 'horizontal' | 'vertical';
  duration?: number;
  style?: ViewStyle | ViewStyle[];
}

/**
 * ShimmerView component adds a subtle shimmer effect overlay to its children
 * Perfect for loading states on buttons, cards, or other interactive elements
 *
 * @param children - The content to overlay with shimmer effect
 * @param isShimmering - Whether the shimmer is active (default: true)
 * @param intensity - Shimmer intensity level (default: 'medium')
 * @param direction - Direction of shimmer animation (default: 'horizontal')
 * @param duration - Animation duration in ms (default: 2000)
 * @param style - Additional container styling
 */
const ShimmerView: React.FC<ShimmerViewProps> = ({
  children,
  isShimmering = true,
  intensity = 'medium',
  direction = 'horizontal',
  duration = 2000,
  style,
}) => {
  const theme = useTheme();
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  // Get shimmer opacity based on intensity
  const getShimmerOpacity = () => {
    switch (intensity) {
      case 'subtle':
        return 0.3;
      case 'strong':
        return 0.8;
      default:
        return 0.5;
    }
  };

  useEffect(() => {
    if (!isShimmering) {
      shimmerAnim.setValue(0);
      return;
    }

    const animateShimmer = () => {
      shimmerAnim.setValue(0);
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration,
        useNativeDriver: false,
      }).start(() => {
        if (isShimmering) {
          // Small delay before restarting
          setTimeout(animateShimmer, 300);
        }
      });
    };

    animateShimmer();
  }, [shimmerAnim, duration, isShimmering]);

  // Create transform based on direction
  const getTransform = () => {
    if (direction === 'vertical') {
      return [
        {
          translateY: shimmerAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [-100, 100],
            extrapolate: 'clamp',
          }),
        },
      ];
    }
    return [
      {
        translateX: shimmerAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [-100, 100],
          extrapolate: 'clamp',
        }),
      },
    ];
  };

  const shimmerOpacity = shimmerAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, getShimmerOpacity(), 0],
    extrapolate: 'clamp',
  });

  const containerStyle: ViewStyle = {
    position: 'relative',
  };

  const shimmerStyle: ViewStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.surfaceHighlight,
  };

  return (
    <View style={[containerStyle, style]}>
      {children}
      {isShimmering && (
        <Animated.View
          style={[
            shimmerStyle,
            {
              opacity: shimmerOpacity,
              transform: getTransform(),
            },
          ]}
          pointerEvents='none'
        />
      )}
    </View>
  );
};

export default ShimmerView;
