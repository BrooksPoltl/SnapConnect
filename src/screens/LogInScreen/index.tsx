import React, { useState, useCallback } from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';

import { AuthStackParamList } from '../../types/navigation';
import { signIn } from '../../services/auth';
import { LoginCredentials, AuthError } from '../../types/auth';
import { useTheme } from '../../styles/theme';
import ReturnButton from '../../components/ReturnButton';

import { styles } from './styles';

// Components

type LogInScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

interface LogInScreenProps {
  navigation: LogInScreenNavigationProp;
}

const LogInScreen: React.FC<LogInScreenProps> = ({ navigation }) => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const theme = useTheme();

  const handleEmailChange = useCallback((email: string) => {
    setCredentials(prev => ({ ...prev, email }));
  }, []);

  const handlePasswordChange = useCallback((password: string) => {
    setCredentials(prev => ({ ...prev, password }));
  }, []);

  const validateForm = (): boolean => {
    if (!credentials.email.trim()) {
      Alert.alert('Validation Error', 'Please enter your email address');
      return false;
    }
    if (!credentials.password.trim()) {
      Alert.alert('Validation Error', 'Please enter your password');
      return false;
    }
    return true;
  };

  const handleSubmit = useCallback(async (): Promise<void> => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await signIn(credentials);
      // Navigation will be handled automatically by useAuthentication hook
    } catch (error) {
      const authError = error as AuthError;
      Alert.alert('Login Failed', authError.message);
    } finally {
      setLoading(false);
    }
  }, [credentials]);

  const dynamicStyles = styles(theme);

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <ReturnButton navigation={navigation} returnName='AuthHome' />

      <View style={dynamicStyles.content}>
        <Text style={dynamicStyles.title}>Log In</Text>

        <View style={dynamicStyles.form}>
          <Text style={dynamicStyles.inputLabel}>EMAIL</Text>
          <TextInput
            style={dynamicStyles.input}
            placeholder='Enter your email'
            placeholderTextColor={theme.colors.textSecondary}
            value={credentials.email}
            onChangeText={handleEmailChange}
            keyboardType='email-address'
            autoCapitalize='none'
            autoCorrect={false}
            editable={!loading}
            accessibilityLabel='Email input field'
            accessibilityHint='Enter your email address'
          />

          <Text style={dynamicStyles.inputLabel}>PASSWORD</Text>
          <TextInput
            style={dynamicStyles.input}
            placeholder='Enter your password'
            placeholderTextColor={theme.colors.textSecondary}
            value={credentials.password}
            onChangeText={handlePasswordChange}
            secureTextEntry={true}
            autoCapitalize='none'
            autoCorrect={false}
            editable={!loading}
            accessibilityLabel='Password input field'
            accessibilityHint='Enter your password'
          />
        </View>

        <TouchableOpacity
          style={[
            dynamicStyles.submitButton,
            (loading || !credentials.email || !credentials.password) &&
              dynamicStyles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={loading || !credentials.email || !credentials.password}
          accessibilityRole='button'
          accessibilityLabel='Log in button'
          accessibilityHint='Tap to log in with your credentials'
        >
          {loading ? (
            <ActivityIndicator color={theme.colors.background} />
          ) : (
            <Text style={dynamicStyles.submitButtonText}>Log In</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LogInScreen;
