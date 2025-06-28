/**
 * ConversationCard Component
 *
 * A unified conversation card component based on the AI card design.
 * Used across different screens for consistent conversation display.
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { Icon, Avatar } from '../';
import { useTheme } from '../../styles/theme';

import { styles } from './styles';

export interface ConversationCardProps {
  /** Main title text */
  title: string;
  /** Secondary metadata text */
  subtitle: string;
  /** Optional unread count badge */
  unreadCount?: number;
  /** Optional username for avatar (takes precedence over leftIcon) */
  username?: string;
  /** Optional avatar size (default: 44) */
  avatarSize?: number;
  /** Optional left icon name (used if no username provided) */
  leftIcon?: string;
  /** Optional left icon color */
  leftIconColor?: string;
  /** Whether to show chevron on right (default: true) */
  showChevron?: boolean;
  /** Custom right content instead of chevron */
  rightContent?: React.ReactNode;
  /** Press handler */
  onPress: () => void;
  /** Optional test ID for testing */
  testID?: string;
}

/**
 * Unified conversation card component with consistent styling
 */
const ConversationCard: React.FC<ConversationCardProps> = ({
  title,
  subtitle,
  unreadCount,
  username,
  avatarSize = 44,
  leftIcon,
  leftIconColor,
  showChevron = true,
  rightContent,
  onPress,
  testID,
}) => {
  const theme = useTheme();
  const dynamicStyles = styles(theme);

  return (
    <TouchableOpacity
      style={dynamicStyles.container}
      onPress={onPress}
      testID={testID}
      accessibilityRole='button'
      accessibilityLabel={`${title}, ${subtitle}`}
    >
      {/* Inner Glossy Overlays for 3D Effect */}
      <View style={dynamicStyles.innerGloss} />
      <View style={dynamicStyles.innerShadow} />

      {/* Main Content Wrapper */}
      <View style={dynamicStyles.contentWrapper}>
        {/* Left Avatar or Icon */}
        {username ? (
          <View style={dynamicStyles.avatarContainer}>
            <Avatar username={username} size={avatarSize} />
          </View>
        ) : leftIcon ? (
          <View style={dynamicStyles.leftIconContainer}>
            <Icon
              name={leftIcon}
              size={24}
              color={leftIconColor ?? theme.colors.white}
              backgroundContainer={true}
              containerColor={leftIconColor === 'white' ? theme.colors.primary : undefined}
              enable3D={true}
            />
          </View>
        ) : null}

        {/* Content */}
        <View style={dynamicStyles.content}>
          <Text style={dynamicStyles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={dynamicStyles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        </View>

        {/* Right Content */}
        <View style={dynamicStyles.rightContainer}>
          {/* Unread Count Badge */}
          {unreadCount && unreadCount > 0 && (
            <View style={dynamicStyles.unreadBadge}>
              <Text style={dynamicStyles.unreadText}>
                {unreadCount > 99 ? '99+' : unreadCount.toString()}
              </Text>
            </View>
          )}

          {/* Custom Right Content or Chevron */}
          {rightContent ??
            (showChevron && (
              <Icon
                name='chevron-right'
                size={20}
                color={theme.colors.textSecondary}
                enable3D={true}
                shadowColor='rgba(0, 0, 0, 0.4)'
              />
            ))}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ConversationCard;
