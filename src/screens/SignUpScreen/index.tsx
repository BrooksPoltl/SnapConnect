import React, { useState, useCallback } from 'react';
import { View, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';

import { AuthStackParamList } from '../../types/navigation';
import { signUp } from '../../services/auth';
import { saveUserData } from '../../services/firestore';
import { SignUpCredentials, AuthError } from '../../types/auth';
import { useTheme } from '../../styles/theme';
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
    if (!credentials.email.trim() || !credentials.password.trim()) {
      Alert.alert('Validation Error', 'Please fill in all fields.');
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
      // Create user account
      const user = await signUp(credentials);

      // Save additional user data to Firestore
      await saveUserData(user.uid, {
        email: credentials.email,
        name: credentials.name,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Navigation will be handled automatically by useAuthentication hook
    } catch (error) {
      const authError = error as AuthError;
      if (authError) {
        Alert.alert('Sign Up Failed', authError.message);
      } else {
        Alert.alert('Sign Up Failed', 'An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  }, [credentials, validateForm]);

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
      <ReturnButton navigation={navigation} returnName='AuthHome' />

      <ScrollView
        contentContainerStyle={dynamicStyles.scrollContent}
        keyboardShouldPersistTaps='handled'
      >
        <View style={dynamicStyles.content}>
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
