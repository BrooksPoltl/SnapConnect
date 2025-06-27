/**
 * Group chat type definitions
 * Defines interfaces for group messaging functionality
 */

export interface Group {
  group_id: number;
  group_name: string;
  creator_id: string;
  member_count: number;
  last_message_id: number;
  last_message_content: string | null;
  last_message_sender_id?: string;
  last_message_sender_username?: string;
  last_message_created_at?: string;
  unread_count: number;
  last_activity: string;
}

export interface GroupMember {
  group_id: number;
  user_id: string;
  username: string;
  score: number;
  joined_at: string;
}

export interface GroupMessage {
  id: number;
  sender_id: string;
  sender_username: string;
  content_type: 'text' | 'image' | 'video';
  content_text?: string;
  storage_path?: string;
  created_at: string;
  viewed_at?: string;
  is_own_message: boolean;
  local_uri?: string;
  status?: 'sending' | 'sent' | 'failed';
}

export interface CreateGroupRequest {
  name: string;
  memberIds: string[];
}

export interface GroupReadReceipt {
  group_id: number;
  user_id: string;
  last_read_at: string;
}

export interface GroupDetails {
  id: number;
  name: string;
  creator_id: string;
  created_at: string;
  updated_at: string;
  members: GroupMember[];
}

// For realtime subscriptions
export interface GroupMessageEvent {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new: GroupMessage;
  old?: GroupMessage;
}

// For navigation
export interface GroupConversationParams {
  groupId: number;
  groupName: string;
}

export interface AddGroupMembersParams {
  groupId: number;
  groupName: string;
  currentMembers: GroupMember[];
}
