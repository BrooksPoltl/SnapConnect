import { useFocusEffect, useNavigation, NavigationProp } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getStoriesFeed } from '../../services';
import { StoryFeedItem, UserStackParamList } from '../../types';
import { styles } from './styles';
import { useTheme } from '../../styles/theme';
import { Ionicons } from '@expo/vector-icons';
import { logError } from '../../utils/logger';
import { Avatar } from '../../components/Avatar';

export const StoriesScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<UserStackParamList>>();
  const theme = useTheme();
  const dynamicStyles = styles(theme);
  const [feed, setFeed] = useState<StoryFeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      const fetchFeed = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const data = await getStoriesFeed();
          // Filter out users who have no visible stories
          const filteredData = data.filter(item => item.stories && item.stories.length > 0);
          setFeed(filteredData);
        } catch (e) {
          setError('Failed to load stories. Please try again.');
          logError('StoriesScreen', 'Failed to fetch stories feed', e);
        } finally {
          setIsLoading(false);
        }
      };

      fetchFeed();
    }, []),
  );

  const renderStoryItem = ({ item }: { item: StoryFeedItem }) => (
    <Pressable
      style={dynamicStyles.storyItem}
      onPress={() =>
        navigation.navigate('StoryViewer', {
          stories: item.stories,
          username: item.username,
        })
      }
    >
      <Avatar username={item.username} isViewed={item.all_stories_viewed} size={60} />
      <Text style={dynamicStyles.username} numberOfLines={1}>
        {item.username}
      </Text>
    </Pressable>
  );

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
      <View style={dynamicStyles.content}>
        {isLoading && <ActivityIndicator />}
        {error && <Text>{error}</Text>}
        {!isLoading && !error && (
          <FlatList
            data={feed}
            renderItem={renderStoryItem}
            keyExtractor={item => item.author_id}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={dynamicStyles.storiesBar}
          />
        )}
      </View>
    </SafeAreaView>
  );
};
