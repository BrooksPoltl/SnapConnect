import React from 'react';
import { Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { logOut } from '../services/auth';

import MapScreen from '../screens/MapScreen';
import CameraScreen from '../screens/CameraScreen';
import StoriesScreen from '../screens/StoriesScreen';
import SpotlightScreen from '../screens/SpotlightScreen';
import MediaPreviewScreen from '../screens/MediaPreviewScreen';
import { logError } from '../utils/logger';
import { Icon } from '../components';
import { useTheme } from '../styles/theme';
import { UserStackParamList } from '../types/navigation';

import ChatStack from './ChatStack';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator<UserStackParamList>();

const getIconName = (routeName: string): string => {
  switch (routeName) {
    case 'Insights':
      return 'trending-up';
    case 'ChatStack':
      return 'message-square';
    case 'Camera':
      return 'camera';
    case 'Stories':
      return 'users';
    case 'Spotlight':
      return 'play-circle';
    default:
      return 'help-circle';
  }
};

/**
 * Main tab navigator for the authenticated user
 * Contains all the primary app screens accessible via bottom tabs
 */
const MainTabNavigator: React.FC = () => {
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
    <Tab.Navigator
      initialRouteName='Camera'
      screenOptions={({ route }) => ({
        tabBarIcon: ({ size }) => (
          <Icon name={getIconName(route.name)} size={size || 24} color={theme.colors.white} />
        ),
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
  );
};

/**
 * Main user stack navigator
 * Includes tab navigation and modal/overlay screens like MediaPreview
 */
const UserStack: React.FC = () => (
  <NavigationContainer>
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name='Main' component={MainTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen
        name='MediaPreview'
        component={MediaPreviewScreen}
        options={{
          presentation: 'modal',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default UserStack;
