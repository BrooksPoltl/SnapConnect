import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackScreenProps } from '@react-navigation/stack';

import { ChatStackParamList } from '../../types/navigation';
import { useTheme } from '../../styles/theme';

import { styles } from './styles';

type ConversationScreenProps = StackScreenProps<ChatStackParamList, 'Conversation'>;

const ConversationScreen: React.FC<ConversationScreenProps> = ({ route }) => {
  const { userId, userName } = route.params;
  const theme = useTheme();
  const dynamicStyles = styles(theme);

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <View style={dynamicStyles.content}>
        <Text style={dynamicStyles.title}>Conversation with {userName}</Text>
        <Text style={dynamicStyles.subtitle}>User ID: {userId}</Text>
        <Text style={dynamicStyles.subtitle}>Chat functionality coming soon!</Text>

        <View style={dynamicStyles.placeholderContainer}>
          <Text style={dynamicStyles.placeholderText}>
            This is where the chat interface will be implemented:
          </Text>
          <Text style={dynamicStyles.featureList}>• Message list with timestamps</Text>
          <Text style={dynamicStyles.featureList}>• Text input for new messages</Text>
          <Text style={dynamicStyles.featureList}>• Photo/media sharing</Text>
          <Text style={dynamicStyles.featureList}>• Real-time message updates</Text>
          <Text style={dynamicStyles.featureList}>• Message status indicators</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ConversationScreen;
