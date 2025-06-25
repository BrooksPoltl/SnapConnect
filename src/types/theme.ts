/**
 * Theme type definitions for the SnapConnect app
 * Provides type safety for all theme-related properties
 */

export interface ColorPalette {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  warning: string;
  disabled: string;
  white: string;
  transparent: string;
  overlay: string;
  shadow: string;
}

export interface Colors {
  light: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
    warning: string;
    disabled: string;
    white: string;
    transparent: string;
    overlay: string;
    shadow: string;
  };
  dark: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
    warning: string;
    disabled: string;
    white: string;
    transparent: string;
    overlay: string;
    shadow: string;
  };
}

export type ThemeColor = keyof Colors['light'] | keyof Colors['dark'];

export interface Spacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

export interface FontSizes {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  xxxl: number;
}

export interface FontWeights {
  regular: '400';
  medium: '500';
  semibold: '600';
  bold: '700';
}

export interface BorderRadius {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  pill: number;
  circle: number;
}

export interface Dimensions {
  screenWidth: number;
  screenHeight: number;
  isSmallScreen: boolean;
  isLargeScreen: boolean;
}

/**
 * Complete theme interface combining all theme properties
 */
export interface Theme {
  colors: ColorPalette;
  spacing: Spacing;
  fontSizes: FontSizes;
  fontWeights: FontWeights;
  borderRadius: BorderRadius;
  dimensions: Dimensions;
  isDark: boolean;
}
