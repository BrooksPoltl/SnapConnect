import { useColorScheme, Dimensions } from 'react-native';

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
    secondary: '#5856D6',
    background: '#FFFFFF',
    surface: '#F2F2F7',
    text: '#000000',
    textSecondary: '#8E8E93',
    border: '#C6C6C8',
    error: '#FF3B30',
    success: '#34C759',
    warning: '#FF9500',
    disabled: '#F2F2F7',
  },
  dark: {
    primary: '#0A84FF',
    secondary: '#5E5CE6',
    background: '#000000',
    surface: '#1C1C1E',
    text: '#FFFFFF',
    textSecondary: '#8E8E93',
    border: '#38383A',
    error: '#FF453A',
    success: '#30D158',
    warning: '#FF9F0A',
    disabled: '#2C2C2E',
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
 * Hook to get theme colors based on current color scheme
 */
export const useTheme = (): Theme => {
  const colorScheme = useColorScheme();
  const themeColors = colorScheme === 'dark' ? colors.dark : colors.light;

  return {
    colors: themeColors,
    spacing,
    fontSizes,
    fontWeights,
    borderRadius,
    dimensions,
    isDark: colorScheme === 'dark',
  };
};
