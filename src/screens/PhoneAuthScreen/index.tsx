import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

import { AuthStackParamList } from '../../types/navigation';
import { useTheme } from '../../styles/theme';
import ReturnButton from '../../components/ReturnButton';

import { styles } from './styles';

type PhoneAuthScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'PhoneAuth'>;

interface PhoneAuthScreenProps {
  navigation: PhoneAuthScreenNavigationProp;
}

const PhoneAuthScreen: React.FC<PhoneAuthScreenProps> = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [confirm, setConfirm] = useState<FirebaseAuthTypes.ConfirmationResult | null>(null);
  const theme = useTheme();
  const dynamicStyles = styles(theme);

  const signInWithPhoneNumber = async () => {
    if (!phoneNumber.startsWith('+')) {
      Alert.alert(
        'Invalid Phone Number',
        'Please include your country code, starting with a "+".\n(e.g., +1 for North America)',
      );
      return;
    }
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setConfirm(confirmation);
    } catch (_error) {
      Alert.alert('Error', 'Invalid phone number or verification failed.');
    }
  };

  const confirmCode = async () => {
    try {
      await confirm?.confirm(code);
      // User is signed in automatically. Navigation is handled by the useAuthentication hook.
    } catch (_error) {
      Alert.alert('Error', 'Invalid code.');
    }
  };

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <ReturnButton navigation={navigation} returnName='AuthHome' />
      <View style={dynamicStyles.content}>
        {!confirm ? (
          <>
            <Text style={dynamicStyles.title}>Enter Phone Number</Text>
            <TextInput
              style={dynamicStyles.input}
              placeholder='+1 650-555-3434'
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType='phone-pad'
            />
            <TouchableOpacity style={dynamicStyles.button} onPress={signInWithPhoneNumber}>
              <Text style={dynamicStyles.buttonText}>Send Code</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={dynamicStyles.title}>Enter Verification Code</Text>
            <TextInput
              style={dynamicStyles.input}
              placeholder='123456'
              value={code}
              onChangeText={setCode}
              keyboardType='number-pad'
            />
            <TouchableOpacity style={dynamicStyles.button} onPress={confirmCode}>
              <Text style={dynamicStyles.buttonText}>Confirm Code</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default PhoneAuthScreen;
