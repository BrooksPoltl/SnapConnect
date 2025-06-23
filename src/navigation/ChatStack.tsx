import React from 'react';
import { Button } from 'react-native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { getAuth, signOut } from 'firebase/auth';

import ChatScreen from '../screens/ChatScreen';
import ConversationScreen from '../screens/ConversationScreen';
import { ChatStackParamList } from '../types/navigation';
import { logError } from '../utils/logger';

const Stack = createStackNavigator<ChatStackParamList>();

interface ChatStackProps {
  navigation?: StackNavigationProp<ChatStackParamList>;
}

const ChatStack: React.FC<ChatStackProps> = ({ navigation: _navigation }) => {
  const auth = getAuth();
  let _user = auth.currentUser;

  const screenOptions = {
    tabBarShowLabel: false,
    headerLeft: () => (
      <Button
        onPress={() => {
          signOut(auth)
            .then(() => {
              // Sign-out successful.
              _user = null;
            })
            .catch(error => {
              // An error happened.
              logError('ChatStack', 'Sign out error', error);
            });
        }}
        title='Log Out'
      />
    ),
  };

  return (
    <Stack.Navigator>
      <Stack.Screen name='ChatHome' component={ChatScreen} options={screenOptions} />
      <Stack.Screen name='Conversation' component={ConversationScreen} />
    </Stack.Navigator>
  );
};

export default ChatStack;
