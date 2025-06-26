import { supabase } from './supabase';
import { CapturedMedia, MyStoryAnalytics, StoryFeedItem } from '../types';
import { logger } from '../utils/logger';
import { uploadMedia } from './media';

// A helper to generate a unique file path for storage
const generateStoryFilePath = (userId: string, mediaType: 'image' | 'video') => {
  const fileExtension = mediaType === 'image' ? 'jpg' : 'mp4';
  return `${userId}/story_${new Date().toISOString()}.${fileExtension}`;
};

/**
 * Fetches the user's stories feed from the backend.
 * @returns A promise that resolves to an array of StoryFeedItem objects.
 */
export async function getStoriesFeed(): Promise<StoryFeedItem[]> {
  const { data, error } = await supabase.rpc('get_stories_feed');

  if (error) {
    logger.error('Error fetching stories feed:', error);
    throw new Error(error.message);
  }

  return (data as StoryFeedItem[] | null) ?? [];
}

/**
 * Marks a specific story as viewed by the current user.
 * @param storyId - The ID of the story to mark as viewed.
 */
export async function markStoryViewed(storyId: number): Promise<void> {
  const { error } = await supabase.rpc('mark_story_viewed', {
    p_story_id: storyId,
  });

  if (error) {
    // We don't throw here to avoid interrupting the user experience for a non-critical error.
  }
}

/**
 * Posts a new story. This involves uploading the media to storage and then
 * calling the post_story RPC to record it in the database.
 * @param mediaUri - The local file URI of the photo or video.
 * @param mediaType - The type of media ('image' or 'video').
 * @param privacy - The privacy setting for the story ('public' or 'private_friends').
 * @param userId - The ID of the user posting the story.
 */
export async function postStory(
  mediaUri: string,
  mediaType: 'image' | 'video',
  privacy: 'public' | 'private_friends',
  userId: string,
): Promise<void> {
  // 1. Generate a unique file path
  const filePath = generateStoryFilePath(userId, mediaType);

  // 2. Construct the media object required by the upload service
  const mediaFile: CapturedMedia = {
    uri: mediaUri,
    type: mediaType === 'image' ? 'photo' : 'video',
  };

  // 3. Upload the media file using the centralized service
  await uploadMedia(mediaFile, 'media', filePath);

  // 4. Call the database function to create the story record
  const { error: rpcError } = await supabase.rpc('post_story', {
    p_storage_path: filePath,
    p_media_type: mediaType,
    p_privacy: privacy,
  });

  if (rpcError) {
    // Attempt to clean up the uploaded file if the DB insert fails
    await supabase.storage.from('media').remove([filePath]);
    logger.error('Error creating story record:', rpcError);
    throw new Error(rpcError.message);
  }
}

/**
 * Deletes a story. This calls the delete_story RPC to delete the database
 * record, and then uses the returned storage path to delete the object from
 * Supabase Storage.
 * @param storyId - The ID of the story to delete.
 */
export async function deleteStory(storyId: number): Promise<void> {
  // 1. Call the RPC to delete the database record and get the storage path.
  const { data: storagePath, error: rpcError } = await supabase.rpc('delete_story', {
    p_story_id: storyId,
  });

  if (rpcError) {
    logger.error('Error deleting story record:', rpcError);
    throw new Error(rpcError.message);
  }

  if (!storagePath) {
    logger.warn('No storage path returned for deleted story, skipping storage deletion.', {
      storyId,
    });
    // This might happen if the story had no media, so we don't throw an error.
    return;
  }

  // 2. Delete the actual file from Supabase Storage.
  const { error: storageError } = await supabase.storage.from('media').remove([storagePath]);

  if (storageError) {
    // Log the error, but don't throw. The DB record is gone, which is the most
    // important part. We don't want the user to see an error if only the
    // storage cleanup failed. The file will be orphaned, which is not ideal,
    // but better than a failed user experience.
    logger.error('Error deleting story object from storage:', {
      storyId,
      storagePath,
      storageError,
    });
  }
}

/**
 * Fetches the viewers for a given story.
 * @param storyId - The ID of the story to fetch viewers for.
 * @returns A promise that resolves to the story's analytics.
 */
export async function getStoryViewers(storyId: number): Promise<MyStoryAnalytics> {
  const { data, error } = await supabase.rpc('get_story_viewers', {
    p_story_id: storyId,
  });

  if (error) {
    logger.error('Error fetching story viewers:', error);
    throw new Error(error.message);
  }

  return data as MyStoryAnalytics;
}
