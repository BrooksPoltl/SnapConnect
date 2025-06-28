import { useFocusEffect, useNavigation, NavigationProp } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getStoriesFeed } from '../../services';
import { StoryFeedItem, UserStackParamList } from '../../types';
import { styles } from './styles';
import { useTheme } from '../../styles/theme';
import { Ionicons } from '@expo/vector-icons';
import { logError } from '../../utils/logger';
import { Avatar, FadeInAnimation, AnimatedPressable } from '../../components';
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

  const renderStoryItem = ({ item, index }: { item: StoryFeedItem; index: number }) => {
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
      <FadeInAnimation delay={index * 100} duration={400}>
        <AnimatedPressable style={dynamicStyles.storyItem} onPress={handlePress} scaleValue={0.95}>
          <Avatar
            username={isOwnStory ? 'Your Story' : item.username}
            isViewed={item.all_stories_viewed}
            size={60}
          />
          <Text style={dynamicStyles.username} numberOfLines={1}>
            {isOwnStory ? 'Your Story' : item.username}
          </Text>
        </AnimatedPressable>
      </FadeInAnimation>
    );
  };

  const renderGroupItem = ({ item, index }: { item: (typeof groups)[0]; index: number }) => {
    const handlePress = () => {
      navigation.navigate('GroupConversation', {
        groupId: item.group_id.toString(),
        groupName: item.group_name,
      });
    };

    return (
      <FadeInAnimation delay={200 + index * 80} duration={400}>
        <AnimatedPressable style={dynamicStyles.groupItem} onPress={handlePress} scaleValue={0.98}>
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
        </AnimatedPressable>
      </FadeInAnimation>
    );
  };

  const handleCreateGroup = () => {
    navigation.navigate('CreateGroup');
  };

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <FadeInAnimation duration={500}>
        <View style={dynamicStyles.header}>
          <Text style={dynamicStyles.headerTitle}>Stories</Text>
          <AnimatedPressable
            onPress={() => navigation.navigate('Friends')}
            style={dynamicStyles.friendsButton}
            scaleValue={0.9}
          >
            <Ionicons name='people-outline' size={24} color={theme.colors.primary} />
          </AnimatedPressable>
        </View>
      </FadeInAnimation>

      <FlatList
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        ListHeaderComponent={
          <View>
            {/* Stories Section */}
            {isLoading && (
              <FadeInAnimation>
                <ActivityIndicator style={dynamicStyles.loadingIndicator} />
              </FadeInAnimation>
            )}
            {error && (
              <FadeInAnimation>
                <View style={dynamicStyles.placeholderContainer}>
                  <Text style={dynamicStyles.placeholderText}>{error}</Text>
                </View>
              </FadeInAnimation>
            )}
            {!isLoading && !error && (
              <View>
                {feed.length > 0 ? (
                  <FadeInAnimation delay={300}>
                    <FlatList
                      data={feed}
                      renderItem={renderStoryItem}
                      keyExtractor={item => item.author_id}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      style={dynamicStyles.storiesBar}
                    />
                  </FadeInAnimation>
                ) : (
                  <FadeInAnimation>
                    <View style={dynamicStyles.placeholderContainer}>
                      <Text style={dynamicStyles.placeholderText}>No stories to show.</Text>
                    </View>
                  </FadeInAnimation>
                )}
              </View>
            )}

            {/* Groups Section */}
            <FadeInAnimation delay={500} duration={600}>
              <View style={dynamicStyles.groupsSection}>
                <Text style={dynamicStyles.sectionTitle}>Groups</Text>
                <AnimatedPressable
                  style={dynamicStyles.createGroupButton}
                  onPress={handleCreateGroup}
                  scaleValue={0.95}
                >
                  <Ionicons name='add' size={20} color={theme.colors.white} />
                  <Text style={dynamicStyles.createGroupButtonText}>Create Group</Text>
                </AnimatedPressable>
              </View>
            </FadeInAnimation>
          </View>
        }
        data={groups}
        renderItem={renderGroupItem}
        keyExtractor={item => item.group_id.toString()}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !groupsLoading && groups.length === 0 ? (
            <FadeInAnimation>
              <View style={dynamicStyles.placeholderContainer}>
                <Text style={dynamicStyles.placeholderText}>
                  No groups yet. Create your first group!
                </Text>
              </View>
            </FadeInAnimation>
          ) : null
        }
      />
    </SafeAreaView>
  );
};
