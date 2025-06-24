import { StyleSheet } from 'react-native';

import { Theme } from '../../types/theme';

export const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: theme.spacing.xl,
    },
    logoContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logo: {
      fontSize: 80,
    },
    buttonsContainer: {
      width: '100%',
      paddingHorizontal: theme.spacing.lg,
    },
    button: {
      paddingVertical: 15,
      borderRadius: theme.borderRadius.lg,
      alignItems: 'center',
      width: '80%',
      marginVertical: 10,
      elevation: 2,
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    loginButton: {
      backgroundColor: theme.colors.surface,
      borderWidth: 2,
      borderColor: theme.colors.primary,
    },
    signUpButton: {
      backgroundColor: theme.colors.primary,
    },
    googleButton: {
      backgroundColor: theme.colors.secondary,
    },
    phoneButton: {
      backgroundColor: theme.colors.success,
    },
    buttonText: {
      color: theme.colors.background,
      fontSize: theme.fontSizes.lg,
      fontWeight: theme.fontWeights.semibold,
    },
    logInText: {
      color: theme.colors.primary,
      fontSize: theme.fontSizes.md,
      marginTop: theme.spacing.lg,
    },
    title: {
      fontSize: theme.fontSizes.xxxl,
      fontWeight: theme.fontWeights.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.xxl,
    },
  });
