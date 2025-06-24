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
      paddingVertical: 15,
      borderRadius: 30,
      alignItems: 'center',
      width: '80%',
      marginVertical: 10,
    },
    loginButton: {
      backgroundColor: '#F13A56', // Snapchat red
    },
    signUpButton: {
      backgroundColor: theme.colors.primary,
    },
    googleButton: {
      backgroundColor: '#db4437', // Google's brand color
    },
    phoneButton: {
      backgroundColor: theme.colors.success, // A generic green for phone auth
    },
    buttonText: {
      color: theme.colors.text,
      fontSize: 18,
      fontWeight: 'bold',
    },
    logInText: {
      color: theme.colors.primary,
      marginTop: 20,
    },
    title: {
      fontSize: 48,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 50,
    },
  });
