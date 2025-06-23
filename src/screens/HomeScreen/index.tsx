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

  const handleLoginPress = () => {
    navigation.navigate('Login');
  };

  const handleSignUpPress = () => {
    navigation.navigate('SignUp');
  };

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <View style={dynamicStyles.content}>
        <View style={dynamicStyles.logoContainer}>
          <Text style={dynamicStyles.logo}>👻</Text>
        </View>

        <View style={dynamicStyles.buttonsContainer}>
          <TouchableOpacity
            style={[dynamicStyles.button, dynamicStyles.loginButton]}
            onPress={handleLoginPress}
            accessibilityRole='button'
            accessibilityLabel='Log in'
            accessibilityHint='Navigate to login screen'
          >
            <Text style={dynamicStyles.buttonText}>LOG IN</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[dynamicStyles.button, dynamicStyles.signUpButton]}
            onPress={handleSignUpPress}
            accessibilityRole='button'
            accessibilityLabel='Sign up'
            accessibilityHint='Navigate to sign up screen'
          >
            <Text style={dynamicStyles.buttonText}>SIGN UP</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
