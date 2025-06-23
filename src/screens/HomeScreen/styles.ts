import { StyleSheet } from 'react-native';

import { Theme } from '../../types/theme';

export const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FDFC02', // Snapchat yellow
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
      alignItems: 'center',
      paddingVertical: theme.spacing.lg,
      width: '100%',
      marginBottom: theme.spacing.sm,
      borderRadius: theme.borderRadius.sm,
    },
    loginButton: {
      backgroundColor: '#F13A56', // Snapchat red
    },
    signUpButton: {
      backgroundColor: '#11AEFF', // Snapchat blue
    },
    buttonText: {
      color: theme.colors.background,
      fontSize: theme.fontSizes.xl,
      fontWeight: theme.fontWeights.semibold,
      letterSpacing: 2,
      textTransform: 'uppercase',
    },
  });
