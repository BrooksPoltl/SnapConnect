import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';

import { AuthStackParamList } from '../../types/navigation';
import { useTheme } from '../../styles/theme';

import { styles } from './styles';

type HomeScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'AuthHome'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const dynamicStyles = styles(theme);

  const onPhoneButtonPress = () => {
    navigation.navigate('PhoneAuth');
  };

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <View style={dynamicStyles.content}>
        <Text style={dynamicStyles.title}>SnapConnect</Text>
        <TouchableOpacity
          style={[dynamicStyles.button, dynamicStyles.signUpButton]}
          onPress={() => navigation.navigate('SignUp')}
          accessibilityRole='button'
          accessibilityLabel='Sign up with email'
        >
          <Text style={dynamicStyles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[dynamicStyles.button, dynamicStyles.phoneButton]}
          onPress={onPhoneButtonPress}
          accessibilityRole='button'
          accessibilityLabel='Sign in with your phone number'
        >
          <Text style={dynamicStyles.buttonText}>Sign In with Phone</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={dynamicStyles.logInText}>Already have an account? Log In</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
