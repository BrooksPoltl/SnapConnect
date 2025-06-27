/**
 * GroupDetailsScreen - Screen for viewing and managing group details
 * Shows group information, member list, and management options
 */
import React, { useEffect, useState } from 'react';
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
import { Avatar } from '../../components/Avatar';
import type { GroupMember } from '../../types/groups';
import { styles } from './styles';

interface GroupDetailsParams {
  groupId: string;
  groupName: string;
}

export const GroupDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { groupId, groupName } = route.params as GroupDetailsParams;

  const { currentGroupDetails, loadGroupDetails, leaveGroup, isLoading, error, clearError } =
    useGroupStore();

  const [isLeavingGroup, setIsLeavingGroup] = useState(false);

  // Load group details when screen mounts
  useEffect(() => {
    loadGroupDetails(parseInt(groupId, 10));
  }, [groupId, loadGroupDetails]);

  const handleLeaveGroup = () => {
    Alert.alert(
      'Leave Group',
      `Are you sure you want to leave "${groupName}"? You won't be able to see new messages.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: async () => {
            setIsLeavingGroup(true);
            try {
              await leaveGroup(parseInt(groupId, 10));
              Alert.alert('Left Group', 'You have left the group successfully.', [
                {
                  text: 'OK',
                  onPress: () => {
                    // Navigate back to previous screens
                    navigation.goBack();
                  },
                },
              ]);
            } catch {
              Alert.alert('Error', 'Failed to leave group. Please try again.');
            } finally {
              setIsLeavingGroup(false);
            }
          },
        },
      ],
    );
  };

  const handleAddMembers = () => {
    // TODO: Navigate to AddGroupMembers screen when implemented
    Alert.alert('Coming Soon', 'Adding members feature will be available soon.');
  };

  const renderMember = ({ item }: { item: GroupMember }) => (
    <View style={styles.memberItem}>
      <Avatar username={item.username} size={50} />
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{item.username}</Text>
        <Text style={styles.memberScore}>Score: {item.score}</Text>
        <Text style={styles.memberJoinDate}>
          Joined {new Date(item.joined_at).toLocaleDateString()}
        </Text>
      </View>
      {currentGroupDetails?.creator_id === item.user_id && (
        <View style={styles.creatorBadge}>
          <Text style={styles.creatorBadgeText}>Creator</Text>
        </View>
      )}
    </View>
  );

  if (isLoading && !currentGroupDetails) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name='arrow-back' size={24} color='#007AFF' />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Group Details</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color='#007AFF' />
          <Text style={styles.loadingText}>Loading group details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!currentGroupDetails) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name='arrow-back' size={24} color='#007AFF' />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Group Details</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load group details</Text>
          <TouchableOpacity
            onPress={() => loadGroupDetails(parseInt(groupId, 10))}
            style={styles.retryButton}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name='arrow-back' size={24} color='#007AFF' />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Group Details</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Group Info */}
      <View style={styles.groupInfoSection}>
        <View style={styles.groupAvatar}>
          <Text style={styles.groupAvatarText}>
            {currentGroupDetails.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.groupName}>{currentGroupDetails.name}</Text>
        <Text style={styles.groupMemberCount}>
          {currentGroupDetails.members.length} member
          {currentGroupDetails.members.length !== 1 ? 's' : ''}
        </Text>
        <Text style={styles.groupCreatedDate}>
          Created {new Date(currentGroupDetails.created_at).toLocaleDateString()}
        </Text>
      </View>

      {/* Actions */}
      <View style={styles.actionsSection}>
        <TouchableOpacity style={styles.actionButton} onPress={handleAddMembers}>
          <Ionicons name='person-add' size={20} color='#007AFF' />
          <Text style={styles.actionButtonText}>Add Members</Text>
        </TouchableOpacity>
      </View>

      {/* Members List */}
      <View style={styles.membersSection}>
        <Text style={styles.sectionTitle}>Members</Text>
        <FlatList
          data={currentGroupDetails.members}
          renderItem={renderMember}
          keyExtractor={item => item.user_id}
          showsVerticalScrollIndicator={false}
          style={styles.membersList}
        />
      </View>

      {/* Leave Group Button */}
      <View style={styles.leaveGroupSection}>
        <TouchableOpacity
          style={styles.leaveGroupButton}
          onPress={handleLeaveGroup}
          disabled={isLeavingGroup}
        >
          {isLeavingGroup ? (
            <ActivityIndicator size='small' color='#FFFFFF' />
          ) : (
            <>
              <Ionicons name='exit-outline' size={20} color='#FFFFFF' />
              <Text style={styles.leaveGroupButtonText}>Leave Group</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Error Display */}
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{error}</Text>
          <TouchableOpacity onPress={clearError}>
            <Text style={styles.dismissError}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};
