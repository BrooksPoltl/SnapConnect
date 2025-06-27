/**
 * FriendListItem - Reusable component for displaying friends/users in lists
 * Consistent styling across all friend/member lists with avatar, username, score, and optional actions
 */
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Avatar } from '../Avatar';
import { styles } from './styles';

export interface FriendListItemProps {
  username: string;
  score: number;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  subtitle?: string;
  isSelected?: boolean;
  avatarSize?: number;
}

/**
 * FriendListItem component for displaying users/friends with consistent styling
 * @param username - The username to display
 * @param score - The user's score
 * @param onPress - Callback function when item is pressed
 * @param rightElement - Optional element to display on the right (button, badge, etc.)
 * @param subtitle - Optional subtitle text (e.g., join date)
 * @param isSelected - Whether the item is selected (for multi-select scenarios)
 * @param avatarSize - Size of the avatar (default: 50)
 */
export const FriendListItem: React.FC<FriendListItemProps> = ({
  username,
  score,
  onPress,
  rightElement,
  subtitle,
  isSelected = false,
  avatarSize = 50,
}) => (
  <TouchableOpacity
    style={[styles.container, isSelected && styles.selectedContainer]}
    onPress={onPress}
    disabled={!onPress}
  >
    <Avatar username={username} size={avatarSize} />
    <View style={styles.userInfo}>
      <Text style={styles.username}>{username}</Text>
      <Text style={styles.score}>Score: {score}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
    {rightElement && <View style={styles.rightElement}>{rightElement}</View>}
    {isSelected && (
      <View style={styles.selectedIndicator}>
        <Ionicons name='checkmark-circle' size={24} color='#007AFF' />
      </View>
    )}
  </TouchableOpacity>
);
