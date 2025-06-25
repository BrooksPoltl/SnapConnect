/**
 * SelectRecipientsScreen
 *
 * Allows the user to select one or more friends from their friends list
 * to send a media message to.
 */
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert, Pressable } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import * as friendService from '../../services/friends';
import * as chatService from '../../services/chat';
import { styles } from './styles';
import { logger } from '../../utils/logger';
import type { Friend } from '../../services/friends';
import { useNavigation, RootStackScreenProps } from '../../types/navigation';
import { useTheme } from '../../styles/theme';
import { Theme } from '../../types/theme';

interface FriendListItemProps {
  item: Friend;
  isSelected: boolean;
  onToggle: (id: string) => void;
  styles: ReturnType<typeof styles>;
  theme: Theme;
}

const FriendListItem: React.FC<FriendListItemProps> = ({
  item,
  isSelected,
  onToggle,
  styles,
  theme,
}) => (
  <Pressable style={styles.friendRow} onPress={() => onToggle(item.id)}>
    <View style={styles.avatar}>
      <Text style={styles.avatarText}>{item.username.charAt(0)}</Text>
    </View>
    <Text style={styles.friendName}>{item.username}</Text>
    <Ionicons
      name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
      size={24}
      color={isSelected ? theme.colors.primary : theme.colors.disabled}
    />
  </Pressable>
);

export const SelectRecipientsScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RootStackScreenProps<'SelectRecipients'>['route']>();
  const { media } = route.params;
  const theme = useTheme();
  const dynamicStyles = styles(theme);

  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriendIds, setSelectedFriendIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    async function fetchFriends() {
      try {
        const friendsList = await friendService.getFriendsList();
        setFriends(friendsList);
      } catch (error) {
        logger.error('Failed to fetch friends for selection', error);
        Alert.alert('Error', 'Could not load your friends list.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchFriends();
  }, []);

  const handleToggleFriend = (id: string) => {
    setSelectedFriendIds(currentIds =>
      currentIds.includes(id)
        ? currentIds.filter(friendId => friendId !== id)
        : [...currentIds, id],
    );
  };

  const handleSend = async () => {
    if (selectedFriendIds.length === 0 || isSending) return;

    setIsSending(true);
    try {
      // The new service function will handle the upload and RPC call
      await chatService.sendMediaToFriends(media, selectedFriendIds);

      Alert.alert('Success', 'Your message has been sent!');
      // Navigate to home or camera screen after sending
      navigation.navigate('User', { screen: 'Home' });
    } catch (error) {
      logger.error('Failed to send media to friends', error);
      Alert.alert('Error', 'There was a problem sending your message.');
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <View style={dynamicStyles.centered}>
        <ActivityIndicator size='large' color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={dynamicStyles.container}>
      <Pressable style={dynamicStyles.closeButton} onPress={() => navigation.goBack()}>
        <Ionicons name='close-circle' size={30} color={theme.colors.white} />
      </Pressable>
      <FlatList
        data={friends}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <FriendListItem
            item={item}
            isSelected={selectedFriendIds.includes(item.id)}
            onToggle={handleToggleFriend}
            styles={dynamicStyles}
            theme={theme}
          />
        )}
        ListHeaderComponent={<Text style={dynamicStyles.header}>Select Friends</Text>}
      />
      <Pressable
        style={[
          dynamicStyles.sendButton,
          selectedFriendIds.length === 0 && dynamicStyles.disabledButton,
        ]}
        onPress={handleSend}
        disabled={selectedFriendIds.length === 0 || isSending}
      >
        {isSending ? (
          <ActivityIndicator color={theme.colors.white} />
        ) : (
          <Text style={dynamicStyles.sendButtonText}>
            Send to {selectedFriendIds.length} Friend(s)
          </Text>
        )}
      </Pressable>
    </View>
  );
};
