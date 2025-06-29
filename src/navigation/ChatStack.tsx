import React from 'react';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';

import ChatScreen from '../screens/ChatScreen';
import ConversationScreen from '../screens/ConversationScreen';
import { ChatStackParamList } from '../types/navigation';

const Stack = createStackNavigator<ChatStackParamList>();

interface ChatStackProps {
  navigation?: StackNavigationProp<ChatStackParamList>;
}

const ChatStack: React.FC<ChatStackProps> = ({ navigation: _navigation }) => {

  return (
    <Stack.Navigator>
      <Stack.Screen name='ChatHome' component={ChatScreen}/>
      <Stack.Screen name='Conversation' component={ConversationScreen} />
    </Stack.Navigator>
  );
};

export default ChatStack;
