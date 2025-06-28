import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import { FriendsStackParamList } from '../../navigation/FriendsStack';

import { useTheme } from '../../styles/theme';
import { getFriendsList, removeFriend, Friend } from '../../services/friends';
import { logger } from '../../utils/logger';
import { ConversationCard } from '../../components';

import { styles as createStyles } from './styles';

interface FriendsListScreenProps {
  navigation: StackNavigationProp<FriendsStackParamList>;
}

/**
 * Screen displaying the user's current friends list
 * Provides navigation to AddFriendScreen and user profiles
 */
const FriendsListScreen: React.FC<FriendsListScreenProps> = ({ navigation }) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [_loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [_error, _setError] = useState<string | null>(null);

  const theme = useTheme();
  const styles = createStyles(theme);

  /**
   * Load friends list
   */
  const loadFriends = useCallback(async () => {
    try {
      setLoading(true);
      const friendsList = await getFriendsList();
      setFriends(friendsList);
    } catch (error) {
      logger.error('FriendsListScreen', 'Error loading friends', error);
      Alert.alert('Error', 'Failed to load friends list');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Handle pull-to-refresh
   */
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadFriends();
    setRefreshing(false);
  }, [loadFriends]);

  /**
   * Navigate to user profile
   */
  const handleViewProfile = useCallback(
    (userId: string) => {
      navigation.navigate('Profile', { userId });
    },
    [navigation],
  );

  /**
   * Navigate to AddFriendScreen
   */
  const handleAddFriend = useCallback(() => {
    navigation.navigate('AddFriend');
  }, [navigation]);

  /**
   * Remove a friend with confirmation
   */
  const handleRemoveFriend = useCallback(async (friendId: string, username: string) => {
    Alert.alert('Remove Friend', `Are you sure you want to remove ${username} from your friends?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          try {
            await removeFriend(friendId);
            setFriends(prev => prev.filter(friend => friend.id !== friendId));
            Alert.alert('Success', `${username} has been removed from your friends`);
          } catch (error) {
            logger.error('FriendsListScreen', 'Error removing friend', error);
            Alert.alert('Error', 'Failed to remove friend');
          }
        },
      },
    ]);
  }, []);

  useEffect(() => {
    loadFriends();
  }, [loadFriends]);

  /**
   * Render a friend item
   */
  const renderFriendItem = (friend: Friend) => (
    <ConversationCard
      key={friend.id}
      title={friend.username}
      subtitle={`Score: ${friend.score}`}
      username={friend.username}
      rightContent={
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveFriend(friend.id, friend.username)}
        >
          <Ionicons name='person-remove' size={20} color={theme.colors.error} />
        </TouchableOpacity>
      }
      showChevron={false}
      onPress={() => handleViewProfile(friend.id)}
      testID={`friend-${friend.id}`}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name='arrow-back' size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Friends</Text>
        <TouchableOpacity onPress={handleAddFriend}>
          <Ionicons name='person-add' size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {friends.length > 0 ? (
          <View style={styles.friendsList}>
            <Text style={styles.friendsCount}>
              {friends.length} {friends.length === 1 ? 'Friend' : 'Friends'}
            </Text>
            {friends.map(renderFriendItem)}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name='people-outline' size={64} color={theme.colors.textSecondary} />
            <Text style={styles.emptyStateText}>No friends yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Add friends to start connecting and sharing content
            </Text>
            <TouchableOpacity style={styles.addFriendsButton} onPress={handleAddFriend}>
              <Text style={styles.addFriendsButtonText}>Add Friends</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default FriendsListScreen;
