import React from 'react';
import { View, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';

import { AuthStackParamList } from '../../types/navigation';
import { useTheme } from '../../styles/theme';
import ReturnButton from '../../components/ReturnButton';
import AuthButton from '../../components/AuthButton';

import { styles } from './styles';

type PhoneAuthScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'PhoneAuth'>;

interface PhoneAuthScreenProps {
  navigation: PhoneAuthScreenNavigationProp;
}

const PhoneAuthScreen: React.FC<PhoneAuthScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const dynamicStyles = styles(theme);

  const handleComingSoon = () => {
    Alert.alert(
      'Coming Soon',
      'Phone authentication will be available in a future update. Please use email authentication for now.',
      [
        {
          text: 'OK',
          onPress: () => {
            if (navigation?.canGoBack?.()) {
              navigation.goBack();
            } else {
              navigation?.navigate('AuthHome');
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <ReturnButton navigation={navigation} returnName='AuthHome' />
      <View style={dynamicStyles.content}>
        <Text style={dynamicStyles.title}>Phone Authentication</Text>
        <Text style={dynamicStyles.title}>
          Phone authentication is temporarily unavailable while we transition to our new backend.
        </Text>
        <AuthButton
          title='Back to Login'
          onPress={handleComingSoon}
          loading={false}
          disabled={false}
        />
      </View>
    </SafeAreaView>
  );
};

export default PhoneAuthScreen;
