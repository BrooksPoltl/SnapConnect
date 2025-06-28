import { Dimensions } from 'react-native';

import {
  Colors,
  Spacing,
  FontSizes,
  FontWeights,
  BorderRadius,
  Dimensions as ThemeDimensions,
  Theme,
} from '../types/theme';

export type { Theme };

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const colors: Colors = {
  light: {
    primary: '#1E88E5',
    secondary: '#42A5F5',
    background: '#FFFFFF',
    surface: '#FFFFFF',
    text: '#000000',
    textSecondary: '#6D6D80',
    border: '#E9ECEF',
    error: '#EF4444',
    success: '#22C55E',
    warning: '#F97316',
    disabled: '#D1D5DB',
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',
    overlay: 'rgba(0, 0, 0, 0.5)',
    overlayDark: 'rgba(0, 0, 0, 0.6)',
    shadow: '#000000',
    gradientStart: '#1E88E5',
    gradientEnd: '#1565C0',
    cardShadow: 'rgba(30, 136, 229, 0.1)',
    accent: '#64B5F6',
    surfaceHighlight: '#F5F5F5',
  },
  dark: {
    primary: '#1E88E5',
    secondary: '#42A5F5',
    background: '#0A0A0B',
    surface: '#1A1A1E',
    text: '#FFFFFF',
    textSecondary: '#A0A0A8',
    border: '#2A2A30',
    error: '#FF6B6B',
    success: '#4ECDC4',
    warning: '#FFD93D',
    disabled: '#4A4A52',
    white: '#FFFFFF',
    black: '#0A0A0B',
    transparent: 'transparent',
    overlay: 'rgba(10, 10, 11, 0.8)',
    overlayDark: 'rgba(10, 10, 11, 0.9)',
    shadow: 'rgba(30, 136, 229, 0.15)',
    gradientStart: '#1E88E5',
    gradientEnd: '#1565C0',
    cardShadow: 'rgba(30, 136, 229, 0.1)',
    accent: '#64B5F6',
    surfaceHighlight: '#242428',
  },
};

export const spacing: Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const fontSizes: FontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const fontWeights: FontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const borderRadius: BorderRadius = {
  sm: 6,
  md: 12,
  lg: 18,
  xl: 24,
  pill: 28,
  circle: 50,
};

export const dimensions: ThemeDimensions = {
  screenWidth,
  screenHeight,
  isSmallScreen: screenWidth < 375,
  isLargeScreen: screenWidth >= 414,
};

export const animations = {
  timing: {
    fast: 200,
    medium: 300,
    slow: 500,
    slower: 700,
  },
  spring: {
    damping: 15,
    stiffness: 150,
    mass: 1,
  },
  easing: {
    ease: [0.25, 0.1, 0.25, 1],
    easeIn: [0.42, 0, 1, 1],
    easeOut: [0, 0, 0.58, 1],
    easeInOut: [0.42, 0, 0.58, 1],
  },
};

export const elevation = {
  small: {
    shadowColor: colors.dark.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: colors.dark.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: colors.dark.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

/**
 * Hook to get theme colors - SnapConnect uses dark mode only
 */
export const useTheme = (): Theme => {
  // Force dark mode for SnapConnect - it's designed as a dark-themed app
  const themeColors = colors.dark;

  return {
    colors: themeColors,
    spacing,
    fontSizes,
    fontWeights,
    borderRadius,
    dimensions,
    isDark: true,
  };
};
