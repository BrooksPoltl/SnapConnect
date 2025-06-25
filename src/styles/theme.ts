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

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const colors: Colors = {
  light: {
    primary: '#007AFF',
    secondary: '#EC4899',
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
    transparent: 'transparent',
    overlay: 'rgba(0, 0, 0, 0.5)',
    shadow: '#000000',
  },
  dark: {
    primary: '#007AFF',
    secondary: '#F472B6',
    background: '#000000',
    surface: '#1A1A1A',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    border: '#333333',
    error: '#F87171',
    success: '#4ADE80',
    warning: '#FB923C',
    disabled: '#4B5563',
    white: '#FFFFFF',
    transparent: 'transparent',
    overlay: 'rgba(0, 0, 0, 0.5)',
    shadow: '#000000',
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
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  pill: 25,
  circle: 50,
};

export const dimensions: ThemeDimensions = {
  screenWidth,
  screenHeight,
  isSmallScreen: screenWidth < 375,
  isLargeScreen: screenWidth >= 414,
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
