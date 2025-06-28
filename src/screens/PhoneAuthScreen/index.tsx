import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';

import { AuthStackParamList } from '../../types/navigation';
import { useTheme } from '../../styles/theme';
import ReturnButton from '../../components/ReturnButton';
import AuthButton from '../../components/AuthButton';
import FormField from '../../components/FormField';
import { signInWithPhone, verifyPhoneOtp } from '../../services/auth';
import { logger } from '../../utils/logger';

import { styles } from './styles';

type PhoneAuthScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'PhoneAuth'>;

interface PhoneAuthScreenProps {
  navigation: PhoneAuthScreenNavigationProp;
}

type AuthStep = 'phone' | 'otp';

const PhoneAuthScreen: React.FC<PhoneAuthScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const dynamicStyles = styles(theme);

  const [currentStep, setCurrentStep] = useState<AuthStep>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handles sending OTP to the entered phone number
   */
  const handleSendOtp = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    try {
      setIsLoading(true);
      logger.info('PhoneAuth', `Sending OTP to ${phoneNumber}`);

      await signInWithPhone(phoneNumber);
      setCurrentStep('otp');

      Alert.alert('Success', 'OTP sent to your phone number');
    } catch (error) {
      logger.error('PhoneAuth', 'Failed to send OTP', error);
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles OTP verification
   */
  const handleVerifyOtp = async () => {
    if (!otpCode.trim() || otpCode.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit code');
      return;
    }

    try {
      setIsLoading(true);
      logger.info('PhoneAuth', 'Verifying OTP');

      await verifyPhoneOtp(phoneNumber, otpCode);

      Alert.alert('Success', 'Phone number verified successfully!');
      // Navigation will be handled by the auth state change
    } catch (error) {
      logger.error('PhoneAuth', 'Failed to verify OTP', error);
      Alert.alert('Error', 'Invalid verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <ReturnButton navigation={navigation} returnName='Back' />

      <View style={dynamicStyles.content}>
        {currentStep === 'phone' ? (
          <>
            <Text style={dynamicStyles.title}>Enter Phone Number</Text>
            <Text style={dynamicStyles.subtitle}>
              We'll send you a verification code to confirm your number
            </Text>

            <View style={dynamicStyles.formField}>
              <FormField
                label='Phone Number'
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder='+1 (555) 123-4567'
                keyboardType='phone-pad'
                autoComplete='tel'
                textContentType='telephoneNumber'
              />
            </View>

            <View style={dynamicStyles.buttonSpacing}>
              <AuthButton
                title='Send Code'
                onPress={handleSendOtp}
                loading={isLoading}
                disabled={!phoneNumber.trim()}
              />
            </View>
          </>
        ) : (
          <>
            <Text style={dynamicStyles.title}>Enter Verification Code</Text>
            <Text style={dynamicStyles.subtitle}>Enter the 6-digit code sent to {phoneNumber}</Text>

            <View style={dynamicStyles.formField}>
              <FormField
                label='Verification Code'
                value={otpCode}
                onChangeText={setOtpCode}
                placeholder='123456'
                keyboardType='number-pad'
                maxLength={6}
                autoComplete='sms-otp'
                textContentType='oneTimeCode'
              />
            </View>

            <View style={dynamicStyles.buttonSpacing}>
              <AuthButton
                title='Verify'
                onPress={handleVerifyOtp}
                loading={isLoading}
                disabled={otpCode.length !== 6}
              />
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default PhoneAuthScreen;
