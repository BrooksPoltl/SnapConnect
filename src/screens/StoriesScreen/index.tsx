import { useFocusEffect, useNavigation, NavigationProp } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getStoriesFeed } from '../../services';
import { StoryFeedItem, UserStackParamList } from '../../types';
import { styles } from './styles';
import { useTheme } from '../../styles/theme';
import { Ionicons } from '@expo/vector-icons';
import { logError } from '../../utils/logger';
import { Avatar } from '../../components/Avatar';
import { useAuthentication } from '../../utils/hooks/useAuthentication';
import { useGroupStore } from '../../stores';

export const StoriesScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<UserStackParamList>>();
  const theme = useTheme();
  const dynamicStyles = styles(theme);
  const { user } = useAuthentication();
  const { groups, loadGroups, isLoading: groupsLoading } = useGroupStore();
  const [feed, setFeed] = useState<StoryFeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Load both stories and groups
      const [storiesData] = await Promise.all([getStoriesFeed(), loadGroups()]);

      // Filter out users who have no visible stories
      const filteredData = storiesData.filter(item => item.stories && item.stories.length > 0);
      setFeed(filteredData);
    } catch (e) {
      setError('Failed to load content. Please try again.');
      logError('StoriesScreen', 'Failed to fetch stories feed or groups', e);
    } finally {
      setIsLoading(false);
    }
  }, [loadGroups]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData]),
  );

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);

  const renderStoryItem = ({ item }: { item: StoryFeedItem }) => {
    const isOwnStory = item.author_id === user?.id;

    const handlePress = () => {
      if (isOwnStory) {
        navigation.navigate('MyStoryViewer', {
          stories: item.stories,
        });
      } else {
        navigation.navigate('StoryViewer', {
          stories: item.stories,
          username: item.username,
        });
      }
    };

    return (
      <Pressable style={dynamicStyles.storyItem} onPress={handlePress}>
        <Avatar
          username={isOwnStory ? 'Your Story' : item.username}
          isViewed={item.all_stories_viewed}
          size={60}
        />
        <Text style={dynamicStyles.username} numberOfLines={1}>
          {isOwnStory ? 'Your Story' : item.username}
        </Text>
      </Pressable>
    );
  };

  const renderGroupItem = ({ item }: { item: (typeof groups)[0] }) => {
    const handlePress = () => {
      navigation.navigate('GroupConversation', {
        groupId: item.group_id.toString(),
        groupName: item.group_name,
      });
    };

    return (
      <Pressable style={dynamicStyles.groupItem} onPress={handlePress}>
        <View style={dynamicStyles.groupAvatar}>
          <Text style={dynamicStyles.groupAvatarText}>
            {item.group_name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={dynamicStyles.groupInfo}>
          <Text style={dynamicStyles.groupName} numberOfLines={1}>
            {item.group_name}
          </Text>
          {item.last_message_content && (
            <Text style={dynamicStyles.groupLastMessage} numberOfLines={1}>
              {item.last_message_sender_username}: {item.last_message_content}
            </Text>
          )}
        </View>
      </Pressable>
    );
  };

  const handleCreateGroup = () => {
    navigation.navigate('CreateGroup');
  };

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <View style={dynamicStyles.header}>
        <Text style={dynamicStyles.headerTitle}>Stories</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Friends')}
          style={dynamicStyles.friendsButton}
        >
          <Ionicons name='people-outline' size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        ListHeaderComponent={
          <View>
            {/* Stories Section */}
            {isLoading && <ActivityIndicator style={dynamicStyles.loadingIndicator} />}
            {error && (
              <View style={dynamicStyles.placeholderContainer}>
                <Text style={dynamicStyles.placeholderText}>{error}</Text>
              </View>
            )}
            {!isLoading && !error && (
              <View>
                {feed.length > 0 ? (
                  <FlatList
                    data={feed}
                    renderItem={renderStoryItem}
                    keyExtractor={item => item.author_id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={dynamicStyles.storiesBar}
                  />
                ) : (
                  <View style={dynamicStyles.placeholderContainer}>
                    <Text style={dynamicStyles.placeholderText}>No stories to show.</Text>
                  </View>
                )}
              </View>
            )}

            {/* Groups Section */}
            <View style={dynamicStyles.groupsSection}>
              <Text style={dynamicStyles.sectionTitle}>Groups</Text>
              <TouchableOpacity style={dynamicStyles.createGroupButton} onPress={handleCreateGroup}>
                <Ionicons name='add' size={20} color={theme.colors.white} />
                <Text style={dynamicStyles.createGroupButtonText}>Create Group</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
        data={groups}
        renderItem={renderGroupItem}
        keyExtractor={item => item.group_id.toString()}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !groupsLoading && groups.length === 0 ? (
            <View style={dynamicStyles.placeholderContainer}>
              <Text style={dynamicStyles.placeholderText}>
                No groups yet. Create your first group!
              </Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
};
