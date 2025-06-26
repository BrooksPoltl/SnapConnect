/**
 * MyStoryViewerScreen Component
 *
 * This screen allows a user to view their own stories, see analytics,
 * and delete them.
 */
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { View, Text, Image, Pressable, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../styles/theme';
import { styles as createStyles } from './styles';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { UserStackParamList, MyStoryAnalytics, StoryViewer, Story } from '../../types';
import { supabase } from '../../services/supabase';
import { Video, ResizeMode } from 'expo-av';
import { Icon } from '../../components';
import { deleteStory, getStoryViewers } from '../../services';
import {
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { logError } from '../../utils/logger';

type MyStoryViewerRouteProp = RouteProp<UserStackParamList, 'MyStoryViewer'>;

export const MyStoryViewerScreen: React.FC = () => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation();
  const route = useRoute<MyStoryViewerRouteProp>();

  const { stories } = route.params;

  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [analytics, setAnalytics] = useState<MyStoryAnalytics | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);

  // Bottom sheet setup
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  const currentStory = stories[currentStoryIndex];

  const fetchMediaUrl = useCallback(
    async (story: Story | undefined) => {
      if (!story) return;
      setIsLoading(true);
      setMediaUrl(null);
      try {
        const { data } = await supabase.storage
          .from('media')
          .createSignedUrl(story.storage_path, 60 * 5); // 5 minute expiry

        if (!data?.signedUrl) {
          throw new Error('Failed to create signed URL');
        }
        setMediaUrl(data.signedUrl);
      } catch (error) {
        logError('MyStoryViewerScreen', 'Error fetching story media URL', {
          error,
          story,
        });
        navigation.goBack();
      } finally {
        setIsLoading(false);
      }
    },
    [navigation],
  );

  useEffect(() => {
    if (currentStory) {
      fetchMediaUrl(currentStory);
    }
  }, [currentStory, fetchMediaUrl]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!currentStory) return;
      try {
        const data = await getStoryViewers(currentStory.id);
        setAnalytics(data);
      } catch (err) {
        // Silently fail on analytics fetch, not critical for user
        logError('MyStoryViewerScreen', 'Failed to fetch story analytics', err);
      }
    };
    fetchAnalytics();
  }, [currentStory]);

  const goToNextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else {
      navigation.goBack(); // Go back if it's the last story
    }
  };

  const goToPreviousStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Story',
      'Are you sure you want to delete this story? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              await deleteStory(currentStory.id);
              navigation.goBack();
            } catch (e) {
              logError('MyStoryViewerScreen', 'Failed to delete story', e);
              Alert.alert('Error', 'Failed to delete story. Please try again.');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ],
    );
  };

  const handleShowViewers = () => {
    bottomSheetModalRef.current?.present();
  };

  const renderViewerItem = ({ item }: { item: StoryViewer }) => (
    <View style={styles.viewerItem}>
      <Text style={styles.viewerUsername}>{item.username}</Text>
      <Text style={styles.viewerTimestamp}>{new Date(item.viewed_at).toLocaleTimeString()}</Text>
    </View>
  );

  if (!mediaUrl) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator color={theme.colors.white} />
      </SafeAreaView>
    );
  }

  return (
    <GestureHandlerRootView style={styles.gestureHandler}>
      <BottomSheetModalProvider>
        <SafeAreaView style={styles.container}>
          {isLoading && (
            <ActivityIndicator
              style={StyleSheet.absoluteFill}
              size='large'
              color={theme.colors.white}
            />
          )}
          <View style={styles.header}>
            <View style={styles.progressBarContainer}>
              {stories.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.progressBar,
                    index <= currentStoryIndex
                      ? styles.progressBarActive
                      : styles.progressBarInactive,
                  ]}
                />
              ))}
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.username}>Your Story</Text>
              <Pressable onPress={() => navigation.goBack()} style={styles.closeButton}>
                <Icon name='x' size={24} color={theme.colors.white} />
              </Pressable>
            </View>
          </View>

          {/* Media Content */}
          {mediaUrl ? (
            currentStory.media_type === 'image' ? (
              <Image source={{ uri: mediaUrl }} style={styles.media} resizeMode='contain' />
            ) : (
              <Video
                source={{ uri: mediaUrl }}
                style={styles.media}
                shouldPlay
                isLooping={false}
                isMuted={false}
                resizeMode={ResizeMode.CONTAIN}
                onPlaybackStatusUpdate={status => {
                  if ('didJustFinish' in status && status.didJustFinish) {
                    goToNextStory();
                  }
                }}
              />
            )
          ) : (
            <Text style={styles.errorText}>Error loading story media.</Text>
          )}

          {/* Navigation Taps */}
          <View style={StyleSheet.absoluteFill} pointerEvents='box-none'>
            <Pressable style={styles.prevArea} onPress={goToPreviousStory} />
            <Pressable style={styles.nextArea} onPress={goToNextStory} />
          </View>

          {/* Footer with actions */}
          <View style={styles.footer}>
            <Pressable style={styles.footerButton} onPress={handleShowViewers}>
              <Icon name='eye' size={24} color={theme.colors.white} />
              <Text style={styles.footerText}>{analytics?.view_count ?? 0} Views</Text>
            </Pressable>
            <Pressable style={styles.footerButton} onPress={handleDelete}>
              <Icon name='trash-2' size={24} color={theme.colors.white} />
              <Text style={styles.footerText}>Delete</Text>
            </Pressable>
          </View>

          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={1}
            snapPoints={snapPoints}
            backgroundStyle={{ backgroundColor: theme.colors.surface }}
          >
            <BottomSheetFlatList
              data={analytics?.viewers ?? []}
              keyExtractor={item => item.user_id}
              renderItem={renderViewerItem}
              contentContainerStyle={styles.bottomSheetContent}
              ListEmptyComponent={
                <Text style={styles.emptyListText}>No one has viewed this story yet.</Text>
              }
            />
          </BottomSheetModal>
        </SafeAreaView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};
