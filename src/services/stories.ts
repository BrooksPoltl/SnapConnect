import { supabase } from './supabase';
import { CapturedMedia, StoryFeedItem } from '../types';
import { logError } from '../utils/logger';
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
    logError('stories.ts', 'Error fetching stories feed:', error);
    throw new Error(error.message);
  }

  return (data as StoryFeedItem[] | null) ?? [];
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
    logError('stories.ts', 'Error creating story record:', rpcError);
    throw new Error(rpcError.message);
  }
}
