import { StyleSheet } from 'react-native';

import { colors, spacing } from '../theme';

export const containerStyles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  screen: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  safeArea: {
    flex: 1,
  },
  padding: {
    padding: spacing.md,
  },
  paddingHorizontal: {
    paddingHorizontal: spacing.md,
  },
  paddingVertical: {
    paddingVertical: spacing.md,
  },
  row: {
    flexDirection: 'row',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowStart: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  rowEnd: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  column: {
    flexDirection: 'column',
  },
  columnCenter: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  columnBetween: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  // Enhanced spacing options
  paddingSmall: {
    padding: spacing.sm,
  },
  paddingLarge: {
    padding: spacing.lg,
  },
  paddingXL: {
    padding: spacing.xl,
  },
  marginSmall: {
    margin: spacing.sm,
  },
  marginMedium: {
    margin: spacing.md,
  },
  marginLarge: {
    margin: spacing.lg,
  },
  marginXL: {
    margin: spacing.xl,
  },
  // Gap utilities for modern layouts
  gapXS: {
    gap: spacing.xs,
  },
  gapSmall: {
    gap: spacing.sm,
  },
  gapMedium: {
    gap: spacing.md,
  },
  gapLarge: {
    gap: spacing.lg,
  },
  gapXL: {
    gap: spacing.xl,
  },
});

// Enhanced containers for specific use cases
export const enhancedContainerStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.dark.surface,
    borderRadius: 12,
    padding: spacing.md,
    shadowColor: colors.dark.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  floatingCard: {
    backgroundColor: colors.dark.surface,
    borderRadius: 16,
    padding: spacing.lg,
    shadowColor: colors.dark.cardShadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  glassmorphism: {
    backgroundColor: 'rgba(26, 26, 30, 0.8)',
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: colors.dark.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  hero: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  section: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  sectionLarge: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.dark.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  footer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    backgroundColor: colors.dark.surface,
    borderTopWidth: 1,
    borderTopColor: colors.dark.border,
  },
  list: {
    paddingHorizontal: spacing.md,
  },
  listItem: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  bottomSheet: {
    backgroundColor: colors.dark.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    shadowColor: colors.dark.shadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  modal: {
    backgroundColor: colors.dark.surface,
    borderRadius: 16,
    padding: spacing.lg,
    margin: spacing.lg,
    shadowColor: colors.dark.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
  overlay: {
    flex: 1,
    backgroundColor: colors.dark.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  surface: {
    backgroundColor: colors.dark.surface,
    borderRadius: 8,
    padding: spacing.md,
  },
  surfaceElevated: {
    backgroundColor: colors.dark.surfaceHighlight,
    borderRadius: 12,
    padding: spacing.md,
    shadowColor: colors.dark.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
});
