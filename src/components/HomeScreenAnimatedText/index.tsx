/**
 * HomeScreenAnimatedText Component
 *
 * A specialized animated text component designed specifically for the HomeScreen.
 * Provides smooth fade-in and slide-up animations optimized for landing page elements
 * like titles, taglines, and subtitles.
 */

import React from 'react';
import { Animated, TextStyle } from 'react-native';

interface HomeScreenAnimatedTextProps {
  children: React.ReactNode;
  animatedValue: Animated.Value;
  style?: TextStyle | TextStyle[];
  slideDistance?: number;
  testID?: string;
}

/**
 * HomeScreen-specific animated text component with entrance animations
 * @param children - Text content to animate (title, tagline, subtitle)
 * @param animatedValue - Animated value (0 to 1) controlling the animation
 * @param style - Text styles to apply (title, tagline, subtitle styles)
 * @param slideDistance - Distance to slide from (default: 20px)
 * @param testID - Test identifier for testing
 */
const HomeScreenAnimatedText: React.FC<HomeScreenAnimatedTextProps> = ({
  children,
  animatedValue,
  style,
  slideDistance = 20,
  testID,
}) => (
  <Animated.View
    style={{
      opacity: animatedValue,
      transform: [
        {
          translateY: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [slideDistance, 0],
          }),
        },
      ],
    }}
    testID={testID}
  >
    <Animated.Text style={style}>{children}</Animated.Text>
  </Animated.View>
);

export default HomeScreenAnimatedText;
