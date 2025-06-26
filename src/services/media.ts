import { supabase } from './supabase';
import { CapturedMedia } from '../types';
import { logger } from '../utils/logger';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';

/**
 * Uploads a media file to a specified Supabase Storage bucket.
 * This is the centralized function for all media uploads in the application.
 * It reads the file from the local URI, converts it to an ArrayBuffer, and uploads it.
 *
 * @param mediaFile - The local media file object (uri and type).
 * @param bucket - The name of the bucket to upload the file to (e.g., 'media').
 * @param filePath - The full, unique path for the file in storage (e.g., 'userId/story_timestamp.jpg').
 * @returns Promise<string> - The public storage path of the uploaded file.
 */
export async function uploadMedia(
  mediaFile: CapturedMedia,
  bucket: string,
  filePath: string,
): Promise<string> {
  try {
    const { uri, type } = mediaFile;
    const contentType = type === 'photo' ? 'image/jpeg' : 'video/mp4';

    logger.log('[uploadMedia] Starting upload:', { uri, type, bucket, filePath });

    // Check if file exists before trying to read it
    const fileInfo = await FileSystem.getInfoAsync(uri);
    logger.log('[uploadMedia] File info:', fileInfo);

    if (!fileInfo.exists) {
      throw new Error(`File does not exist at URI: ${uri}`);
    }

    // Read the file from its local URI into a base64 string
    logger.log('[uploadMedia] Reading file from URI:', uri);
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    logger.log('[uploadMedia] Successfully read file, base64 length:', base64.length);

    // Upload the decoded base64 string (which becomes an ArrayBuffer)
    const { data, error } = await supabase.storage.from(bucket).upload(filePath, decode(base64), {
      contentType,
      upsert: false, // We expect unique paths, so no need to upsert
    });

    if (error) {
      logger.error('Error uploading media with Supabase client:', { error, bucket, filePath });
      throw new Error(`Failed to upload media: ${error.message}`);
    }

    logger.info(`Successfully uploaded media. Path: ${data.path}`);
    return data.path;
  } catch (error) {
    logger.error('Error in uploadMedia:', { error, bucket, filePath });
    if (error instanceof Error) {
      // Re-throw the specific error for better call stack tracing
      throw error;
    }
    throw new Error('An unknown error occurred during media upload.');
  }
}

/**
 * Creates a signed URL to access a media file securely.
 * The URL is temporary and expires after a set duration.
 *
 * @param storagePath - The full path of the file in the storage bucket.
 * @param expiresIn - The time in seconds that the URL will be valid for (default: 60).
 * @returns Promise<string> - The temporary signed URL for the media.
 */
export async function getSignedMediaUrl(
  storagePath: string,
  expiresIn: number = 60,
): Promise<string> {
  try {
    const { data, error } = await supabase.storage
      .from('media')
      .createSignedUrl(storagePath, expiresIn);

    if (error) {
      logger.error('Error creating signed URL:', { path: storagePath, error });
      throw error;
    }

    if (!data?.signedUrl) {
      throw new Error('Could not retrieve signed URL.');
    }

    return data.signedUrl;
  } catch (error) {
    logger.error('Error in getSignedMediaUrl:', { path: storagePath, error });
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unknown error occurred while creating a signed URL.');
  }
}
