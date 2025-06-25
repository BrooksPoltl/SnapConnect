/**
 * Media types for photo and video handling
 * Used throughout the camera and preview functionality
 */

export interface CapturedMedia {
  uri: string;
  type: 'photo' | 'video';
  width?: number;
  height?: number;
  duration?: number; // Video duration in milliseconds
  size?: number; // File size in bytes
}

export interface VideoRecordingOptions {
  quality?: '480p' | '720p' | '1080p' | '2160p' | '4:3';
  maxDuration?: number; // Maximum duration in seconds
  maxFileSize?: number; // Maximum file size in bytes
  mute?: boolean; // Record without audio
}

export interface MediaPreviewProps {
  media: CapturedMedia;
  onDiscard: () => void;
  onSave: () => void;
  onNext: () => void;
}
