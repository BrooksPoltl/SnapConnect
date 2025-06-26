import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { AuthStackParamList } from '../types/navigation';
// Screens
import HomeScreen from '../screens/HomeScreen';
import LogInScreen from '../screens/LogInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import PhoneAuthScreen from '../screens/PhoneAuthScreen';

const Stack = createStackNavigator<AuthStackParamList>();

const AuthStack: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name='AuthHome' component={HomeScreen} />
    <Stack.Screen name='Login' component={LogInScreen} />
    <Stack.Screen name='SignUp' component={SignUpScreen} />
    <Stack.Screen name='PhoneAuth' component={PhoneAuthScreen} />
  </Stack.Navigator>
);

export default AuthStack;
