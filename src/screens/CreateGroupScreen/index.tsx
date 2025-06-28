/**
 * CreateGroupScreen - Screen for creating a new group chat
 * Allows users to set a group name and select initial members
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { useGroupStore } from '../../stores/groupStore';
import { searchUsersForGroup } from '../../services/groups';
import type { GroupMember } from '../../types/groups';
import { ConversationCard, SelectedUserCard } from '../../components';
import FormField from '../../components/FormField';

import { styles } from './styles';

export const CreateGroupScreen = () => {
  const navigation = useNavigation();
  const { createGroup, isLoading, error, clearError } = useGroupStore();

  const [groupName, setGroupName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GroupMember[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<GroupMember[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Search for users when query changes
  useEffect(() => {
    const searchUsers = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const results = await searchUsersForGroup(searchQuery.trim());
        setSearchResults(results);
      } catch {
        // Error searching users
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(searchUsers, 300); // Debounce search
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSelectMember = (user: GroupMember) => {
    const isAlreadySelected = selectedMembers.some(member => member.user_id === user.user_id);

    if (isAlreadySelected) {
      setSelectedMembers(selectedMembers.filter(member => member.user_id !== user.user_id));
    } else {
      setSelectedMembers([...selectedMembers, user]);
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      Alert.alert('Error', 'Please enter a group name');
      return;
    }

    if (selectedMembers.length === 0) {
      Alert.alert('Error', 'Please select at least one member to add to the group');
      return;
    }

    try {
      const memberIds = selectedMembers.map(member => member.user_id);
      const groupId = await createGroup(groupName.trim(), memberIds);

      Alert.alert('Success', 'Group created successfully!', [
        {
          text: 'OK',
          onPress: () => {
            navigation.goBack();
            // Navigate to the new group conversation
            // Navigate to the new group conversation
            // @ts-ignore - Navigation will be properly typed when navigation is set up
            navigation.navigate('GroupConversation', {
              groupId,
              groupName: groupName.trim(),
            });
          },
        },
      ]);
    } catch {
      Alert.alert('Error', 'Failed to create group. Please try again.');
    }
  };

  const renderSelectedMember = ({ item }: { item: GroupMember }) => (
    <SelectedUserCard
      username={item.username}
      onRemove={() => handleSelectMember(item)}
      size={40}
    />
  );

  const renderSearchResult = ({ item }: { item: GroupMember }) => {
    const isSelected = selectedMembers.some(member => member.user_id === item.user_id);

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
        onPress={() => handleSelectMember(item)}
        testID={`user-${item.user_id}`}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name='arrow-back' size={24} color='#007AFF' />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Group</Text>
          <TouchableOpacity
            style={[
              styles.createButton,
              (!groupName.trim() || selectedMembers.length === 0) && styles.createButtonDisabled,
            ]}
            onPress={handleCreateGroup}
            disabled={!groupName.trim() || selectedMembers.length === 0 || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size='small' color='#FFFFFF' />
            ) : (
              <Text style={styles.createButtonText}>Create</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Group Name Input */}
        <View style={styles.groupNameSection}>
          <Text style={styles.sectionTitle}>Group Name</Text>
          <FormField
            value={groupName}
            onChangeText={setGroupName}
            placeholder='Enter group name...'
            maxLength={50}
            containerStyle={styles.formFieldNoMargin}
          />
        </View>

        {/* Selected Members */}
        {selectedMembers.length > 0 && (
          <View style={styles.selectedMembersSection}>
            <Text style={styles.sectionTitle}>Selected Members ({selectedMembers.length})</Text>
            <FlatList
              data={selectedMembers}
              renderItem={renderSelectedMember}
              keyExtractor={item => item.user_id}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.selectedMembersList}
            />
          </View>
        )}

        {/* Search Section */}
        <View style={styles.searchSection}>
          <Text style={styles.sectionTitle}>Add Members</Text>
          <FormField
            variant='search'
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder='Search users...'
            autoCapitalize='none'
            autoCorrect={false}
            spellCheck={false}
            leftIcon='search'
            rightIcon={isSearching ? undefined : undefined}
            containerStyle={styles.formFieldNoMargin}
          />
          {isSearching && (
            <View style={styles.searchLoader}>
              <ActivityIndicator size='small' color='#007AFF' />
            </View>
          )}
        </View>

        {/* Search Results */}
        <FlatList
          data={searchResults}
          renderItem={renderSearchResult}
          keyExtractor={item => item.user_id}
          style={styles.searchResults}
          contentContainerStyle={styles.searchResultsContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            searchQuery.length >= 2 && !isSearching ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No users found</Text>
              </View>
            ) : null
          }
        />

        {/* Error Display */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={clearError}>
              <Text style={styles.dismissError}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
