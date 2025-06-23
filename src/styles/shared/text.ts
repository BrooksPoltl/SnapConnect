import { StyleSheet } from 'react-native';

import { colors, fontSizes, fontWeights } from '../theme';

export const textStyles = StyleSheet.create({
  h1: {
    fontSize: fontSizes.xxxl,
    fontWeight: fontWeights.bold,
    color: colors.light.text,
  },
  h2: {
    fontSize: fontSizes.xxl,
    fontWeight: fontWeights.bold,
    color: colors.light.text,
  },
  h3: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semibold,
    color: colors.light.text,
  },
  body: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.regular,
    color: colors.light.text,
  },
  bodySmall: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.regular,
    color: colors.light.textSecondary,
  },
  caption: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.regular,
    color: colors.light.textSecondary,
  },
  bold: {
    fontWeight: fontWeights.bold,
  },
  semibold: {
    fontWeight: fontWeights.semibold,
  },
  center: {
    textAlign: 'center',
  },
  uppercase: {
    textTransform: 'uppercase',
  },
});
