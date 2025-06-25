import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import FriendsListScreen from '../screens/FriendsListScreen';
import AddFriendScreen from '../screens/AddFriendScreen';
import ProfileScreen from '../screens/ProfileScreen';

export type FriendsStackParamList = {
  FriendsList: undefined;
  AddFriend: undefined;
  Profile: { userId?: string };
};

const Stack = createStackNavigator<FriendsStackParamList>();

/**
 * Friends navigation stack
 * Contains screens for managing friends and viewing profiles
 */
const FriendsStack: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen
      name='FriendsList'
      component={FriendsListScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen name='AddFriend' component={AddFriendScreen} options={{ headerShown: false }} />
    <Stack.Screen name='Profile' component={ProfileScreen} options={{ headerShown: false }} />
  </Stack.Navigator>
);

export default FriendsStack;
