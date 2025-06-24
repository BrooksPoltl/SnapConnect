import React from 'react';
import { Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { logOut } from '../services/auth';

import MapScreen from '../screens/MapScreen';
import CameraScreen from '../screens/CameraScreen';
import StoriesScreen from '../screens/StoriesScreen';
import SpotlightScreen from '../screens/SpotlightScreen';
import { logError } from '../utils/logger';
import { Icon } from '../components';
import { useTheme } from '../styles/theme';

import ChatStack from './ChatStack';

export type UserStackParamList = {
  Insights: undefined;
  ChatStack: undefined;
  Camera: undefined;
  Stories: undefined;
  Spotlight: undefined;
};

const Tab = createBottomTabNavigator<UserStackParamList>();

const UserStack: React.FC = () => {
  const theme = useTheme();

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
          tabBarIcon: ({ focused: _focused, size }) => {
            let iconName: string;

            if (route.name === 'Insights') {
              iconName = 'trending-up';
            } else if (route.name === 'ChatStack') {
              iconName = 'message-square';
            } else if (route.name === 'Camera') {
              iconName = 'camera';
            } else if (route.name === 'Stories') {
              iconName = 'users';
            } else if (route.name === 'Spotlight') {
              iconName = 'play-circle';
            } else {
              iconName = 'help-circle';
            }
            return <Icon name={iconName} size={size || 24} color={theme.colors.white} />;
          },
          tabBarStyle: { backgroundColor: '#000' },
        })}
      >
        <Tab.Screen
          name='Insights'
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
