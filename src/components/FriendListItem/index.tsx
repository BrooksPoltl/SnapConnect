/**
 * FriendListItem - Reusable component for displaying friends/users in lists
 * Consistent styling across all friend/member lists with avatar, username, score, and optional actions
 */
import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Avatar, AnimatedCard, AnimatedPressable } from '../';
import { styles } from './styles';

export interface FriendListItemProps {
  username: string;
  score: number;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  subtitle?: string;
  isSelected?: boolean;
  avatarSize?: number;
  delay?: number;
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
 * @param delay - Animation delay for entrance (default: 0)
 */
export const FriendListItem: React.FC<FriendListItemProps> = ({
  username,
  score,
  onPress,
  rightElement,
  subtitle,
  isSelected = false,
  avatarSize = 50,
  delay = 0,
}) => (
  <AnimatedCard enterFromDirection='left' elevation='small' delay={delay} duration={400}>
    <AnimatedPressable
      style={[styles.container, ...(isSelected ? [styles.selectedContainer] : [])]}
      onPress={onPress}
      disabled={!onPress}
      scaleValue={0.98}
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
    </AnimatedPressable>
  </AnimatedCard>
);
