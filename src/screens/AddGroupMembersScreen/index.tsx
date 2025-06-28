/**
 * AddGroupMembersScreen - Screen for adding new members to an existing group
 * Allows searching and selecting users to add to the group
 */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { useGroupStore } from '../../stores/groupStore';
import { SelectedUserCard, ConversationCard } from '../../components';
import * as groupsService from '../../services/groups';
import type { GroupMember } from '../../types/groups';
import { styles } from './styles';
import FormField from '../../components/FormField';

interface AddGroupMembersParams {
  groupId: string;
  groupName: string;
  currentMembers: GroupMember[];
}

interface SearchUser {
  user_id: string;
  username: string;
  score: number;
}

export const AddGroupMembersScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { groupId, groupName, currentMembers } = route.params as AddGroupMembersParams;

  const { addMembers, error, clearError } = useGroupStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<SearchUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Get current member IDs for filtering (memoized to prevent infinite loops)
  const currentMemberIds = useMemo(
    () => currentMembers.map(member => member.user_id),
    [currentMembers],
  );

  // Debounced search function
  const searchUsers = useCallback(
    async (query: string) => {
      if (query.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const users = await groupsService.searchUsersForGroup(query.trim());
        // Filter out current members
        const availableUsers = users.filter(user => !currentMemberIds.includes(user.user_id));
        setSearchResults(availableUsers);
      } catch (error) {
        console.error('Error searching users:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [currentMemberIds],
  );

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchUsers(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchUsers]);

  const handleSelectUser = (user: SearchUser) => {
    if (selectedUsers.find(selected => selected.user_id === user.user_id)) {
      // Remove from selection
      setSelectedUsers(prev => prev.filter(selected => selected.user_id !== user.user_id));
    } else {
      // Add to selection
      setSelectedUsers(prev => [...prev, user]);
    }
  };

  const handleAddMembers = async () => {
    if (selectedUsers.length === 0) {
      Alert.alert('No Users Selected', 'Please select at least one user to add to the group.');
      return;
    }

    setIsAdding(true);
    try {
      const memberIds = selectedUsers.map(user => user.user_id);
      await addMembers(parseInt(groupId, 10), memberIds);

      Alert.alert(
        'Members Added',
        `Successfully added ${selectedUsers.length} member${selectedUsers.length !== 1 ? 's' : ''} to ${groupName}.`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } catch (addError) {
      console.error('Error adding members:', addError);
      Alert.alert('Error', 'Failed to add members. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  const renderSearchResult = ({ item }: { item: SearchUser }) => {
    const isSelected = selectedUsers.find(selected => selected.user_id === item.user_id);

    return (
      <ConversationCard
        title={item.username}
        subtitle={`Score: ${item.score}`}
        username={item.username}
        rightContent={
          isSelected ? (
            <View style={styles.selectedIndicator}>
              <Text style={styles.selectedText}>✓</Text>
            </View>
          ) : undefined
        }
        showChevron={false}
        onPress={() => handleSelectUser(item)}
        testID={`user-${item.user_id}`}
      />
    );
  };

  const renderSelectedUser = ({ item }: { item: SearchUser }) => (
    <SelectedUserCard username={item.username} onRemove={() => handleSelectUser(item)} size={40} />
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name='arrow-back' size={24} color='#007AFF' />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Add Members</Text>
          <Text style={styles.headerSubtitle}>{groupName}</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.addButton,
            (selectedUsers.length === 0 || isAdding) && styles.addButtonDisabled,
          ]}
          onPress={handleAddMembers}
          disabled={selectedUsers.length === 0 || isAdding}
        >
          {isAdding ? (
            <ActivityIndicator size='small' color='#FFFFFF' />
          ) : (
            <Text style={styles.addButtonText}>Add</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Selected Users */}
      {selectedUsers.length > 0 && (
        <View style={styles.selectedUsersSection}>
          <Text style={styles.sectionTitle}>Selected ({selectedUsers.length})</Text>
          <FlatList
            data={selectedUsers}
            renderItem={renderSelectedUser}
            keyExtractor={item => item.user_id}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.selectedUsersList}
            contentContainerStyle={styles.selectedUsersContent}
          />
        </View>
      )}

      {/* Search Input */}
      <View style={styles.searchSection}>
        <FormField
          variant='search'
          placeholder='Search users...'
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize='none'
          autoCorrect={false}
          spellCheck={false}
          leftIcon='search'
          rightIcon={isSearching ? undefined : undefined}
          containerStyle={styles.formFieldNoMargin}
        />
        {isSearching && (
          <View style={styles.centeredContainer}>
            <ActivityIndicator size='small' color='#007AFF' />
          </View>
        )}
      </View>

      {/* Search Results */}
      <View style={styles.resultsSection}>
        {searchQuery.length < 2 ? (
          <View style={styles.emptyState}>
            <Ionicons name='people' size={48} color='#8E8E93' />
            <Text style={styles.emptyStateText}>Search for users to add</Text>
            <Text style={styles.emptyStateSubtext}>Type at least 2 characters to search</Text>
          </View>
        ) : searchResults.length === 0 && !isSearching ? (
          <View style={styles.emptyState}>
            <Ionicons name='search' size={48} color='#8E8E93' />
            <Text style={styles.emptyStateText}>No users found</Text>
            <Text style={styles.emptyStateSubtext}>Try a different search term</Text>
          </View>
        ) : (
          <FlatList
            data={searchResults}
            renderItem={renderSearchResult}
            keyExtractor={item => item.user_id}
            showsVerticalScrollIndicator={false}
            style={styles.resultsList}
            contentContainerStyle={styles.resultsContent}
          />
        )}
      </View>

      {/* Error Display */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={clearError}>
            <Text style={styles.dismissError}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};
