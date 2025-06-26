import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { useAuthentication } from '../utils/hooks/useAuthentication';
import { RootStackParamList } from '../types/navigation';

import AuthStack from './AuthStack';
import UserStack from './UserStack';

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigation: React.FC = () => {
  const { user } = useAuthentication();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name='User' component={UserStack} />
        ) : (
          <Stack.Screen name='Auth' component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
