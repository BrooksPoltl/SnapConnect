import React from 'react';
import { Button } from 'react-native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { logOut } from '../services/auth';

import ChatScreen from '../screens/ChatScreen';
import ConversationScreen from '../screens/ConversationScreen';
import { ChatStackParamList } from '../types/navigation';
import { logError } from '../utils/logger';

const Stack = createStackNavigator<ChatStackParamList>();

interface ChatStackProps {
  navigation?: StackNavigationProp<ChatStackParamList>;
}

const ChatStack: React.FC<ChatStackProps> = ({ navigation: _navigation }) => {
  const handleLogOut = async () => {
    try {
      await logOut();
      // Sign-out successful - navigation handled by useAuthentication hook
    } catch (error: unknown) {
      logError('ChatStack', 'Sign out error', error);
    }
  };

  const screenOptions = {
    tabBarShowLabel: false,
    headerLeft: () => <Button onPress={handleLogOut} title='Log Out' />,
  };

  return (
    <Stack.Navigator>
      <Stack.Screen name='ChatHome' component={ChatScreen} options={screenOptions} />
      <Stack.Screen name='Conversation' component={ConversationScreen} />
    </Stack.Navigator>
  );
};

export default ChatStack;
