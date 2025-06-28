/**
 * Feed Screen
 * Displays AI posts with tabs for Public and Friends feeds
 */

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../../styles/theme';
import { getPublicFeed, getFriendFeed } from '../../services/ai';
import { Icon, CardSkeleton } from '../../components';
import type { AIPost } from '../../types';

import { styles } from './styles';

type FeedType = 'public' | 'friends';

const FeedScreen: React.FC = () => {
  const theme = useTheme();
  const dynamicStyles = styles(theme);

  const [activeTab, setActiveTab] = useState<FeedType>('public');
  const [publicPosts, setPublicPosts] = useState<AIPost[]>([]);
  const [friendPosts, setFriendPosts] = useState<AIPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  /**
   * Load posts for the specified feed type
   */
  const loadPosts = async (feedType: FeedType, isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const data = feedType === 'public' ? await getPublicFeed(20, 0) : await getFriendFeed(20, 0);

      if (feedType === 'public') {
        setPublicPosts(data);
      } else {
        setFriendPosts(data);
      }
    } catch (error) {
      console.error(`Error loading ${feedType} feed:`, error);
      Alert.alert('Error', `Failed to load ${feedType} feed. Please try again.`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /**
   * Handle tab change
   */
  const handleTabChange = (tab: FeedType) => {
    setActiveTab(tab);
    if (tab === 'public' && publicPosts.length === 0) {
      loadPosts('public');
    } else if (tab === 'friends' && friendPosts.length === 0) {
      loadPosts('friends');
    }
  };

  /**
   * Handle refresh
   */
  const handleRefresh = () => {
    loadPosts(activeTab, true);
  };

  /**
   * Format post creation time
   */
  const formatPostTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  /**
   * Render a single post item
   */
  const renderPostItem = ({ item }: { item: AIPost }) => (
    <View style={dynamicStyles.postItem}>
      <View style={dynamicStyles.postHeader}>
        <Text style={dynamicStyles.username}>@{item.username}</Text>
        <Text style={dynamicStyles.postTime}>{formatPostTime(item.created_at)}</Text>
      </View>

      {item.user_commentary && (
        <Text style={dynamicStyles.userCommentary}>{item.user_commentary}</Text>
      )}

      <View style={dynamicStyles.aiResponseContainer}>
        <Text style={dynamicStyles.aiResponse}>{item.ai_response}</Text>
      </View>

      {item.source_link && (
        <TouchableOpacity style={dynamicStyles.sourceLink}>
          <Icon name='external-link' size={16} color={theme.colors.primary} />
          <Text style={dynamicStyles.sourceLinkText}>View Source</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  /**
   * Render empty state
   */
  const renderEmptyState = () => (
    <View style={dynamicStyles.emptyState}>
      <Icon name='message-square' size={64} color={theme.colors.textSecondary} />
      <Text style={dynamicStyles.emptyStateTitle}>
        No {activeTab === 'public' ? 'Public' : 'Friend'} Posts
      </Text>
      <Text style={dynamicStyles.emptyStateSubtitle}>
        {activeTab === 'public'
          ? 'Be the first to share an AI insight publicly!'
          : "Your friends haven't shared any AI insights yet."}
      </Text>
    </View>
  );

  /**
   * Render tab button
   */
  const renderTabButton = (tab: FeedType, label: string) => (
    <TouchableOpacity
      style={[dynamicStyles.tabButton, activeTab === tab && dynamicStyles.activeTabButton]}
      onPress={() => handleTabChange(tab)}
    >
      <Text
        style={[
          dynamicStyles.tabButtonText,
          activeTab === tab && dynamicStyles.activeTabButtonText,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  useEffect(() => {
    loadPosts('public');
  }, []);

  const currentPosts = activeTab === 'public' ? publicPosts : friendPosts;

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <View style={dynamicStyles.header}>
        <Text style={dynamicStyles.title}>AI Feed</Text>
      </View>

      <View style={dynamicStyles.tabContainer}>
        {renderTabButton('public', 'Public')}
        {renderTabButton('friends', 'Friends')}
      </View>

      {loading ? (
        <CardSkeleton count={4} variant='post' />
      ) : (
        <FlatList
          data={currentPosts}
          renderItem={renderPostItem}
          keyExtractor={item => item.id}
          contentContainerStyle={dynamicStyles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={theme.colors.primary}
            />
          }
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

export default FeedScreen;
