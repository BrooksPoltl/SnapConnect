import React, { useState, useCallback } from 'react';
import { View, Alert, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';

import { AuthStackParamList } from '../../types/navigation';
import { supabase } from '../../services/supabase';
import { signUp } from '../../services/auth';
import { SignUpCredentials, AuthError } from '../../types/auth';
import { useTheme } from '../../styles/theme';
// Utils
import { logger } from '../../utils/logger';
// Components
import ReturnButton from '../../components/ReturnButton';
import FormField from '../../components/FormField';
import AuthButton from '../../components/AuthButton';
import DisclaimerText from '../../components/DisclaimerText';

import { styles } from './styles';

type SignUpScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'SignUp'>;

interface SignUpScreenProps {
  navigation: SignUpScreenNavigationProp;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const [credentials, setCredentials] = useState<SignUpCredentials>({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Partial<SignUpCredentials>>({});
  const theme = useTheme();

  const handleFieldChange = useCallback(
    (field: keyof SignUpCredentials, value: string) => {
      setCredentials(prev => ({ ...prev, [field]: value }));
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: undefined }));
      }
    },
    [errors],
  );

  const validateForm = useCallback(() => {
    if (
      !credentials.name.trim() ||
      !credentials.username.trim() ||
      !credentials.email.trim() ||
      !credentials.password.trim()
    ) {
      Alert.alert('Validation Error', 'Please fill in all fields.');
      return false;
    }
    if (credentials.username.length < 3) {
      Alert.alert('Validation Error', 'Username must be at least 3 characters long.');
      return false;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(credentials.username)) {
      Alert.alert(
        'Validation Error',
        'Username can only contain letters, numbers, and underscores.',
      );
      return false;
    }
    if (credentials.password !== credentials.confirmPassword) {
      Alert.alert('Validation Error', 'Passwords do not match.');
      return false;
    }
    return true;
  }, [credentials]);

  const handleSubmit = useCallback(async (): Promise<void> => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      logger.info('SignUpScreen', 'Starting signup process');

      // Create user account and profile
      const user = await signUp(credentials);

      logger.info('SignUpScreen', 'Signup successful, user created:', user.id);

      // Check if the user is now authenticated
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        logger.error('SignUpScreen', 'Error getting session after signup:', sessionError);
      } else if (session) {
        logger.info('SignUpScreen', 'User is authenticated, session exists');

        // Force a session refresh to trigger the auth state change
        await supabase.auth.refreshSession();

        logger.info('SignUpScreen', 'Session refreshed, navigation should occur automatically');
      } else {
        logger.warn('SignUpScreen', 'No session found after signup, user may need to verify email');
        Alert.alert(
          'Account Created',
          'Your account has been created successfully. You may need to verify your email before signing in.',
          [{ text: 'OK', onPress: () => navigation.navigate('Login') }],
        );
      }
    } catch (error) {
      logger.error('SignUpScreen', 'Signup failed:', error);
      const authError = error as AuthError;
      if (authError) {
        Alert.alert('Sign Up Failed', authError.message);
      } else {
        Alert.alert('Sign Up Failed', 'An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  }, [credentials, validateForm, navigation]);

  const handlePrivacyPress = () => {
    // TODO: Navigate to privacy policy
    Alert.alert('Privacy Policy', 'Privacy policy will be shown here');
  };

  const handleTermsPress = () => {
    // TODO: Navigate to terms of service
    Alert.alert('Terms of Service', 'Terms of service will be shown here');
  };

  const dynamicStyles = styles(theme);

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <ReturnButton navigation={navigation} fallbackRoute='AuthHome' />

      <ScrollView
        contentContainerStyle={dynamicStyles.scrollContent}
        keyboardShouldPersistTaps='handled'
      >
        <View style={dynamicStyles.content}>
          <View style={dynamicStyles.missionContainer}>
            <Text style={dynamicStyles.missionTitle}>Welcome to Fathom Research</Text>
            <Text style={dynamicStyles.missionText}>
              Democratizing investment research for everyone. Break down the walls that keep
              professional-grade research locked away and make smarter, more informed decisions.
            </Text>
          </View>

          <View style={dynamicStyles.form}>
            <FormField
              label='NAME'
              placeholder='Enter your full name'
              value={credentials.name}
              onChangeText={value => handleFieldChange('name', value)}
              autoCapitalize='words'
              autoCorrect={false}
              disabled={loading}
              error={errors.name}
              accessibilityLabel='Name input field'
              accessibilityHint='Enter your full name'
            />

            <FormField
              label='USERNAME'
              placeholder='Enter a unique username'
              value={credentials.username}
              onChangeText={value => handleFieldChange('username', value.toLowerCase())}
              autoCapitalize='none'
              autoCorrect={false}
              disabled={loading}
              error={errors.username}
              accessibilityLabel='Username input field'
              accessibilityHint='Enter a unique username for your profile'
            />

            <FormField
              label='EMAIL'
              placeholder='Enter your email'
              value={credentials.email}
              onChangeText={value => handleFieldChange('email', value)}
              keyboardType='email-address'
              autoCapitalize='none'
              autoCorrect={false}
              disabled={loading}
              error={errors.email}
              accessibilityLabel='Email input field'
              accessibilityHint='Enter your email address'
            />

            <FormField
              label='PASSWORD'
              placeholder='Enter your password'
              value={credentials.password}
              onChangeText={value => handleFieldChange('password', value)}
              secureTextEntry={true}
              textContentType='oneTimeCode'
              autoCapitalize='none'
              autoCorrect={false}
              disabled={loading}
              error={errors.password}
              accessibilityLabel='Password input field'
              accessibilityHint='Enter your password'
            />

            <FormField
              label='CONFIRM PASSWORD'
              placeholder='Confirm your password'
              value={credentials.confirmPassword}
              onChangeText={value => handleFieldChange('confirmPassword', value)}
              secureTextEntry={true}
              textContentType='oneTimeCode'
              autoCapitalize='none'
              autoCorrect={false}
              disabled={loading}
              error={errors.confirmPassword}
              accessibilityLabel='Confirm password input field'
              accessibilityHint='Re-enter your password to confirm'
            />

            <DisclaimerText onPrivacyPress={handlePrivacyPress} onTermsPress={handleTermsPress} />
          </View>

          <AuthButton
            title='Sign Up & Accept'
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUpScreen;
