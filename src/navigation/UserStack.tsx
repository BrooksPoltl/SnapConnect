import React from 'react';
import { Button, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { logOut } from '../services/auth';

import MapScreen from '../screens/MapScreen';
import CameraScreen from '../screens/CameraScreen';
import StoriesScreen from '../screens/StoriesScreen';
import SpotlightScreen from '../screens/SpotlightScreen';
import { logError } from '../utils/logger';

import ChatStack from './ChatStack';

export type UserStackParamList = {
  Map: undefined;
  ChatStack: undefined;
  Camera: undefined;
  Stories: undefined;
  Spotlight: undefined;
};

const Tab = createBottomTabNavigator<UserStackParamList>();

const UserStack: React.FC = () => {
  const handleLogOut = async () => {
    try {
      await logOut();
      // Sign-out successful - navigation handled by useAuthentication hook
    } catch (error: unknown) {
      logError('UserStack', 'Sign out error', error);
    }
  };

  const screenOptions = {
    tabBarShowLabel: false,
    headerLeft: () => <Button onPress={handleLogOut} title='Log Out' />,
  };

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName='Camera'
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, size }) => {
            let icon: string;

            if (route.name === 'Map') {
              icon = focused ? '🗺️' : '📍';
            } else if (route.name === 'ChatStack') {
              icon = focused ? '💬' : '💭';
            } else if (route.name === 'Camera') {
              icon = focused ? '📸' : '📷';
            } else if (route.name === 'Stories') {
              icon = focused ? '👥' : '👤';
            } else if (route.name === 'Spotlight') {
              icon = focused ? '▶️' : '⏯️';
            } else {
              icon = '❓';
            }
            return <Text style={{ fontSize: size || 24 }}>{icon}</Text>;
          },
          tabBarStyle: { backgroundColor: '#000' },
        })}
      >
        <Tab.Screen
          name='Map'
          component={MapScreen}
          options={{ ...screenOptions, headerShown: false }}
        />
        <Tab.Screen
          name='ChatStack'
          component={ChatStack}
          options={{ headerShown: false, tabBarShowLabel: false }}
        />
        <Tab.Screen
          name='Camera'
          component={CameraScreen}
          options={{ ...screenOptions, headerShown: false }}
        />
        <Tab.Screen name='Stories' component={StoriesScreen} options={screenOptions} />
        <Tab.Screen name='Spotlight' component={SpotlightScreen} options={screenOptions} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default UserStack;
