/**
 * SelectedUserCard - Reusable component for displaying selected users
 * Shows user avatar with remove button in top-right corner
 */
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Avatar } from '../Avatar';
import { styles } from './styles';

interface SelectedUserCardProps {
  username: string;
  onRemove: () => void;
  size?: number;
}

/**
 * SelectedUserCard component for displaying selected users with remove functionality
 * @param username - The username to display
 * @param onRemove - Callback function when remove button is pressed
 * @param size - Avatar size (default: 40)
 */
export const SelectedUserCard: React.FC<SelectedUserCardProps> = ({
  username,
  onRemove,
  size = 40,
}) => (
  <View style={styles.container}>
    <Avatar username={username} size={size} />
    <Text style={styles.username}>{username}</Text>
    <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
      <Ionicons name='close' size={16} color='#FFFFFF' />
    </TouchableOpacity>
  </View>
);
