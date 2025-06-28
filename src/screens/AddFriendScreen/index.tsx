import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import { FriendsStackParamList } from '../../navigation/FriendsStack';

import { useTheme } from '../../styles/theme';
import {
  getFriendRequests,
  acceptFriendRequest,
  declineFriendRequest,
  getSuggestedFriends,
  sendFriendRequest,
  FriendRequest,
  Friend,
} from '../../services/friends';
import { searchUsers } from '../../services/user';
import { UserData } from '../../types/user';
import { logger } from '../../utils/logger';
import FormField from '../../components/FormField';
import { ConversationCard } from '../../components';

import { styles as createStyles } from './styles';

interface AddFriendScreenProps {
  navigation: StackNavigationProp<FriendsStackParamList>;
}

/**
 * Screen for managing friend requests and discovering new friends
 * Includes: incoming requests, user search, and suggested friends
 */
const AddFriendScreen: React.FC<AddFriendScreenProps> = ({ navigation }) => {
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [suggestedFriends, setSuggestedFriends] = useState<Friend[]>([]);
  const [searchResults, setSearchResults] = useState<UserData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const theme = useTheme();
  const styles = createStyles(theme);

  /**
   * Load initial data (friend requests and suggestions)
   */
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [requests, suggestions] = await Promise.all([
        getFriendRequests(),
        getSuggestedFriends(10),
      ]);

      setFriendRequests(requests);
      setSuggestedFriends(suggestions);
    } catch (error) {
      logger.error('AddFriendScreen', 'Error loading data', error);
      Alert.alert('Error', 'Failed to load friend data');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Handle pull-to-refresh
   */
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  /**
   * Search for users by username
   */
  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);

    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const results = await searchUsers(query.trim());
      setSearchResults(results);
    } catch (error) {
      logger.error('AddFriendScreen', 'Error searching users', error);
    }
  }, []);

  /**
   * Accept a friend request
   */
  const handleAcceptRequest = useCallback(async (requestId: number) => {
    try {
      await acceptFriendRequest(requestId);
      setFriendRequests(prev => prev.filter(req => req.id !== requestId));
      Alert.alert('Success', 'Friend request accepted!');
    } catch (error) {
      logger.error('AddFriendScreen', 'Error accepting friend request', error);
      Alert.alert('Error', 'Failed to accept friend request');
    }
  }, []);

  /**
   * Decline a friend request
   */
  const handleDeclineRequest = useCallback(async (requestId: number) => {
    try {
      await declineFriendRequest(requestId);
      setFriendRequests(prev => prev.filter(req => req.id !== requestId));
      Alert.alert('Success', 'Friend request declined');
    } catch (error) {
      logger.error('AddFriendScreen', 'Error declining friend request', error);
      Alert.alert('Error', 'Failed to decline friend request');
    }
  }, []);

  /**
   * Send a friend request
   */
  const handleSendRequest = useCallback(async (userId: string, username: string) => {
    try {
      await sendFriendRequest(userId);
      Alert.alert('Success', `Friend request sent to ${username}!`);

      // Remove from search results and suggestions
      setSearchResults(prev => prev.filter(user => user.id !== userId));
      setSuggestedFriends(prev => prev.filter(user => user.id !== userId));
    } catch (error) {
      logger.error('AddFriendScreen', 'Error sending friend request', error);
      Alert.alert('Error', 'Failed to send friend request');
    }
  }, []);

  /**
   * Navigate to user profile
   */
  const handleViewProfile = useCallback(
    (userId: string) => {
      navigation.navigate('Profile', { userId });
    },
    [navigation],
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  /**
   * Render a friend request item
   */
  const renderFriendRequest = (request: FriendRequest) => (
    <ConversationCard
      key={request.id}
      title={request.requester?.username ?? 'Unknown User'}
      subtitle={`Score: ${request.requester?.score ?? 0} • Friend Request`}
      leftIcon='person-add'
      rightContent={
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.acceptButton]}
            onPress={() => handleAcceptRequest(request.id)}
          >
            <Ionicons name='checkmark' size={20} color={theme.colors.white} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.declineButton]}
            onPress={() => handleDeclineRequest(request.id)}
          >
            <Ionicons name='close' size={20} color={theme.colors.white} />
          </TouchableOpacity>
        </View>
      }
      showChevron={false}
      onPress={() => handleViewProfile(request.user_id_1)}
      testID={`request-${request.id}`}
    />
  );

  /**
   * Render a user item (search result or suggestion)
   */
  const renderUserItem = (user: UserData | Friend) => {
    if (!user.id) return null;

    return (
      <ConversationCard
        key={user.id}
        title={user.username ?? 'Unknown User'}
        subtitle={`Score: ${user.score ?? 0}`}
        leftIcon='person'
        rightContent={
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => user.id && handleSendRequest(user.id, user.username ?? 'Unknown User')}
          >
            <Ionicons name='person-add' size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        }
        showChevron={false}
        onPress={() => user.id && handleViewProfile(user.id)}
        testID={`user-${user.id}`}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name='arrow-back' size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Friends</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Search Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Search Users</Text>
          <FormField
            variant='search'
            placeholder='Search by username...'
            value={searchQuery}
            onChangeText={handleSearch}
            autoCapitalize='none'
            autoCorrect={false}
            spellCheck={false}
            leftIcon='search'
            containerStyle={styles.formFieldContainer}
          />

          {searchResults.length > 0 && (
            <View style={styles.resultsContainer}>{searchResults.map(renderUserItem)}</View>
          )}
        </View>

        {/* Friend Requests Section */}
        {friendRequests.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Friend Requests</Text>
            <View style={styles.requestsContainer}>{friendRequests.map(renderFriendRequest)}</View>
          </View>
        )}

        {/* Suggested Friends Section */}
        {suggestedFriends.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Suggested Friends</Text>
            <View style={styles.suggestionsContainer}>{suggestedFriends.map(renderUserItem)}</View>
          </View>
        )}

        {/* Empty State */}
        {!loading &&
          friendRequests.length === 0 &&
          suggestedFriends.length === 0 &&
          searchResults.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name='people-outline' size={64} color={theme.colors.textSecondary} />
              <Text style={styles.emptyStateText}>No friend requests or suggestions</Text>
              <Text style={styles.emptyStateSubtext}>Try searching for users to connect with</Text>
            </View>
          )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddFriendScreen;
