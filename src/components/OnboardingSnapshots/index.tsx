/**
 * OnboardingSnapshots Component
 *
 * Contains scaled-down snapshots of app features for the onboarding flow.
 * Each snapshot demonstrates key functionality to help users understand
 * what they can do with the app.
 */
import React from 'react';
import { View, Text } from 'react-native';
import Icon from '../Icon';
import { useTheme } from '../../styles/theme';
import { styles } from './styles';

interface OnboardingSnapshotProps {
  type: 'welcome' | 'ai-insights' | 'sharing' | 'networking' | 'stories';
}

/**
 * Welcome snapshot - Shows the app logo and mission
 */
const WelcomeSnapshot: React.FC = () => {
  const theme = useTheme();

  return (
    <View style={styles.welcomeContainer}>
      <View style={styles.logoContainer}>
        <Icon name='bar-chart' size={40} color={theme.colors.primary} />
        <Text style={styles.logoText}>Fathom Research</Text>
      </View>
      <View style={styles.missionContainer}>
        <Text style={styles.missionText}>Democratizing Investment Research</Text>
      </View>
    </View>
  );
};

/**
 * AI Insights snapshot - Shows a mock AI conversation
 */
const AIInsightsSnapshot: React.FC = () => {
  const theme = useTheme();

  return (
    <View style={styles.aiContainer}>
      <View style={styles.aiHeader}>
        <Icon name='brain' size={24} color={theme.colors.primary} />
        <Text style={styles.aiTitle}>AI Research Assistant</Text>
      </View>

      <View style={styles.chatBubbleUser}>
        <Text style={styles.chatText}>What's in Tesla's latest 10-Q?</Text>
      </View>

      <View style={styles.chatBubbleAI}>
        <Text style={styles.chatText}>
          Tesla reported $24.3B revenue (+8% YoY) with automotive margins improving to 19.3%...
        </Text>
        <View style={styles.sourceLink}>
          <Icon name='link' size={12} color={theme.colors.accent} />
          <Text style={styles.sourceLinkText}>SEC Filing Source</Text>
        </View>
      </View>
    </View>
  );
};

/**
 * Sharing snapshot - Shows a post with source verification
 */
const SharingSnapshot: React.FC = () => (
  <View style={styles.sharingContainer}>
    <View style={styles.postHeader}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>J</Text>
      </View>
      <View style={styles.postInfo}>
        <Text style={styles.username}>@johnny_trader</Text>
        <Text style={styles.timestamp}>2m ago</Text>
      </View>
    </View>

    <Text style={styles.postContent}>
      Tesla's automotive margins hit 19.3% - highest in 6 quarters. Strong demand for Model Y
      continues.
    </Text>
  </View>
);

/**
 * Networking snapshot - Shows group conversations
 */
const NetworkingSnapshot: React.FC = () => (
  <View style={styles.networkingContainer}>
    <View style={styles.groupCard}>
      <View style={styles.groupHeader}>
        <View style={styles.groupAvatar}>
          <Text style={styles.groupAvatarText}>T</Text>
        </View>
        <Text style={styles.groupName}>Tech Stock Analysis</Text>
      </View>
      <Text style={styles.groupMembers}>12 members • 3 new messages</Text>
    </View>

    <View style={styles.groupCard}>
      <View style={styles.groupHeader}>
        <View style={styles.groupAvatar}>
          <Text style={styles.groupAvatarText}>M</Text>
        </View>
        <Text style={styles.groupName}>Market Movers</Text>
      </View>
      <Text style={styles.groupMembers}>24 members • 8 new messages</Text>
    </View>

    <View style={styles.groupCard}>
      <View style={styles.groupHeader}>
        <View style={styles.groupAvatar}>
          <Text style={styles.groupAvatarText}>P</Text>
        </View>
        <Text style={styles.groupName}>Portfolio Reviews</Text>
      </View>
      <Text style={styles.groupMembers}>7 members • 1 new message</Text>
    </View>
  </View>
);

/**
 * Stories snapshot - Shows ephemeral story previews
 */
const StoriesSnapshot: React.FC = () => {
  const theme = useTheme();

  return (
    <View style={styles.storiesContainer}>
      <View style={styles.storyPreview}>
        <View style={styles.storyAvatar}>
          <Text style={styles.storyAvatarText}>M</Text>
        </View>
        <Text style={styles.storyUsername}>mike_dd</Text>
        <View style={styles.storyIndicator} />
      </View>

      <View style={styles.storyPreview}>
        <View style={[styles.storyAvatar, styles.storyAvatarViewed]}>
          <Text style={styles.storyAvatarText}>S</Text>
        </View>
        <Text style={styles.storyUsername}>sarah_inv</Text>
      </View>

      <View style={styles.storyPreview}>
        <View style={styles.storyAvatar}>
          <Text style={styles.storyAvatarText}>D</Text>
        </View>
        <Text style={styles.storyUsername}>dave_trades</Text>
        <View style={styles.storyIndicator} />
      </View>

      <View style={styles.storyContent}>
        <Icon name='camera' size={32} color={theme.colors.textSecondary} />
        <Text style={styles.storyContentText}>Share your market insights</Text>
      </View>
    </View>
  );
};

/**
 * Main snapshot component that renders the appropriate snapshot based on type
 */
export const OnboardingSnapshot: React.FC<OnboardingSnapshotProps> = ({ type }) => {
  switch (type) {
    case 'welcome':
      return <WelcomeSnapshot />;
    case 'ai-insights':
      return <AIInsightsSnapshot />;
    case 'sharing':
      return <SharingSnapshot />;
    case 'networking':
      return <NetworkingSnapshot />;
    case 'stories':
      return <StoriesSnapshot />;
    default:
      return <WelcomeSnapshot />;
  }
};
