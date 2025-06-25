import React, { useEffect } from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { logOut } from '../services/auth';
import { useChatStore, useUnreadCount } from '../stores';

import MapScreen from '../screens/MapScreen';
import CameraScreen from '../screens/CameraScreen';
import StoriesScreen from '../screens/StoriesScreen';
import SpotlightScreen from '../screens/SpotlightScreen';
import MediaPreviewScreen from '../screens/MediaPreviewScreen';
import ConversationScreen from '../screens/ConversationScreen';
import { logError, logger } from '../utils/logger';
import { Icon } from '../components';
import { useTheme } from '../styles/theme';
import { UserStackParamList } from '../types/navigation';
import { useAuthentication } from '../utils/hooks/useAuthentication';

import ChatStack from './ChatStack';
import FriendsStack from './FriendsStack';

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
  const { user } = useAuthentication();
  const { unreadCount } = useUnreadCount();
  const { initializeRealtime, refreshUnreadCount, reset } = useChatStore();

  // Initialize store and real-time subscriptions when user changes
  useEffect(() => {
    if (user) {
      // Initialize real-time subscriptions
      initializeRealtime(user);
      // Load initial unread count
      refreshUnreadCount();
    } else {
      // Reset store when user logs out
      reset();
    }
  }, [user, initializeRealtime, refreshUnreadCount, reset]);

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

  /**
   * Renders the tab icon with optional unread badge for ChatStack
   */
  const renderTabIcon = (routeName: string, size: number) => {
    const iconName = getIconName(routeName);
    
    if (routeName === 'ChatStack' && unreadCount > 0) {
      return (
        <View style={tabStyles.iconContainer}>
          <Icon name={iconName} size={size || 24} color={theme.colors.white} />
          <View style={tabStyles.badge}>
            <Text style={tabStyles.badgeText}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </Text>
          </View>
        </View>
      );
    }
    
    return <Icon name={iconName} size={size || 24} color={theme.colors.white} />;
  };

  return (
    <Tab.Navigator
      initialRouteName='Camera'
      screenOptions={({ route }) => ({
        tabBarIcon: ({ size }) => renderTabIcon(route.name, size || 24),
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
      <Stack.Screen
        name='Friends'
        component={FriendsStack}
        options={{
          presentation: 'modal',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='Conversation'
        component={ConversationScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

const tabStyles = StyleSheet.create({
  iconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#007AFF', // iOS blue
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
});

export default UserStack;
