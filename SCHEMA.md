# Database Schema Documentation

This document provides a comprehensive overview of the SnapConnect database schema, including tables, relationships, functions, and security policies.

## Overview

SnapConnect uses **Supabase** (PostgreSQL) as its backend database with the following key features:
- **Row Level Security (RLS)** for data protection
- **Ephemeral content** with 24-hour TTL policies
- **Real-time subscriptions** for live messaging
- **Automated scoring system** via database triggers
- **Secure functions** for complex operations

---

## Core Tables

### 1. `auth.users` (Supabase Auth)
**Purpose**: Authentication and user account management (managed by Supabase Auth)

```sql
CREATE TABLE auth.users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  encrypted_password TEXT,
  email_confirmed_at TIMESTAMPTZ,
  -- Additional Supabase Auth fields...
);
```

### 2. `public.profiles`
**Purpose**: Public user profile information

```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 30),
  CONSTRAINT username_format CHECK (username ~ '^[a-zA-Z0-9_]+$'),
  CONSTRAINT score_non_negative CHECK (score >= 0)
);
```

**Indexes:**
- `profiles_username_idx` on `username`
- `profiles_score_idx` on `score DESC`

**RLS Policies:**
- `Public profiles are viewable by everyone` - All users can read profiles
- `Users can insert their own profile` - Users can create their own profile
- `Users can update their own username` - Users can update only their own username

### 3. `public.friendships`
**Purpose**: Friend relationships and requests between users

```sql
CREATE TABLE public.friendships (
  id BIGSERIAL PRIMARY KEY,
  user_id_1 UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_id_2 UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'blocked')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT different_users CHECK (user_id_1 != user_id_2),
  CONSTRAINT unique_friendship UNIQUE (user_id_1, user_id_2)
);
```

**Indexes:**
- `friendships_user_id_1_idx` on `user_id_1`
- `friendships_user_id_2_idx` on `user_id_2`
- `friendships_status_idx` on `status`

**RLS Policies:**
- `Users can view their own friendships` - Users see friendships they're involved in
- `Users can send friend requests` - Users can insert pending requests
- `Users can respond to friend requests` - Recipients can update request status
- `Users can delete their friendships` - Either party can delete the friendship

### 4. `public.chats`
**Purpose**: Chat conversation metadata

```sql
CREATE TABLE public.chats (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Indexes:**
- `chats_created_at_idx` on `created_at`

**RLS Policies:**
- `Users can view their own chats` - Users see chats they participate in
- `Users can create chats` - Any authenticated user can create chats

### 5. `public.chat_participants`
**Purpose**: Many-to-many relationship between chats and users

```sql
CREATE TABLE public.chat_participants (
  chat_id BIGINT NOT NULL REFERENCES public.chats(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  PRIMARY KEY (chat_id, user_id)
);
```

**Indexes:**
- `chat_participants_user_id_idx` on `user_id`

**RLS Policies:**
- `Users can view chat participants` - Users see participants in their chats
- `Users can join chats` - Users can add themselves to chats

### 6. `public.messages`
**Purpose**: Chat messages with ephemeral content (24-hour TTL)

```sql
CREATE TABLE public.messages (
  id BIGSERIAL PRIMARY KEY,
  chat_id BIGINT NOT NULL REFERENCES public.chats(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('text', 'image', 'video')),
  content_text TEXT,
  storage_path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  viewed_at TIMESTAMPTZ NULL,
  
  -- Constraints
  CONSTRAINT message_content_check CHECK (
    (content_type = 'text' AND content_text IS NOT NULL AND storage_path IS NULL) OR
    (content_type IN ('image', 'video') AND storage_path IS NOT NULL AND content_text IS NULL)
  )
);
```

**Indexes:**
- `messages_chat_id_idx` on `chat_id`
- `messages_sender_id_idx` on `sender_id`
- `messages_created_at_idx` on `created_at DESC`
- `messages_viewed_at_idx` on `viewed_at` (where not null)

**RLS Policies:**
- `Users can view messages in their chats with TTL` - Complex policy implementing:
  - User must be chat participant
  - Unread messages never expire (`viewed_at IS NULL`)
  - Read messages expire after 24 hours (`viewed_at > NOW() - INTERVAL '24 hours'`)
- `Users can send messages to their chats` - Users can insert messages to their chats

### 7. `public.stories`
**Purpose**: Ephemeral user stories (24-hour TTL)

```sql
CREATE TABLE public.stories (
  id BIGSERIAL PRIMARY KEY,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  privacy TEXT NOT NULL CHECK (privacy IN ('public', 'private_friends')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
  width INTEGER,
  height INTEGER,
  duration INTEGER -- in seconds, for videos
);
```

**Indexes:**
- `stories_author_id_idx` on `author_id`
- `stories_created_at_idx` on `created_at DESC`
- `stories_privacy_idx` on `privacy`

**RLS Policies:**
- `Users can view recent accessible stories` - Complex policy implementing:
  - Stories must be less than 24 hours old
  - Public stories visible to all
  - Private stories visible only to friends
- `Users can create their own stories` - Users can insert their own stories
- `Users can delete their own stories` - Users can delete their own stories

---

## Storage Buckets

### `media` Bucket
**Purpose**: Stores uploaded images and videos for messages and stories

**Storage Policies:**
- `Allow authenticated uploads to media bucket` - Any authenticated user can upload
- `Allow authenticated view of media` - Users can view media if they're in the chat where it was sent

---

## Database Functions

### User Management

#### `update_username(new_username TEXT)`
**Purpose**: Securely updates a user's username with validation
**Security**: DEFINER (bypasses RLS for validation)
**Validation**:
- Username must be 3-30 characters
- Only alphanumeric and underscore characters
- Must be unique

#### `increment_user_score(user_id UUID, points INTEGER)`
**Purpose**: Atomically increments a user's score
**Called by**: Database triggers on message/story creation

#### `create_user_profile(user_id UUID, user_username TEXT, user_score INTEGER)`
**Purpose**: Creates user profile during signup with validation

### Friend Management

#### `accept_friend_request(request_id BIGINT)`
**Purpose**: Accepts a pending friend request
**Security**: Validates user is the recipient

#### `decline_friend_request(request_id BIGINT)`
**Purpose**: Declines/deletes a pending friend request
**Security**: Validates user is the recipient

#### `get_suggested_friends(limit_count INTEGER DEFAULT 10)`
**Purpose**: Returns random users who aren't already friends
**Returns**: Table of `(id UUID, username TEXT, score INTEGER)`

### Chat & Messaging

#### `create_direct_chat(other_user_id UUID)`
**Purpose**: Creates or retrieves existing direct chat between friends
**Security**: Validates users are friends
**Returns**: `BIGINT` (chat_id)

#### `get_user_conversations()`
**Purpose**: Retrieves user's conversation list including friends without chats
**Returns**: Complex table with chat info, last message, and unread counts
**Features**:
- Shows existing chats with message history
- Shows friends without chats (chat_id = 0)
- Includes unread message counts
- Ordered by last activity

#### `mark_messages_as_viewed(p_chat_id BIGINT)`
**Purpose**: Marks unread messages as viewed by current user
**Features**:
- Only updates messages from other users
- Sends PostgreSQL notification for real-time updates
- Security validated (user must be chat participant)

#### `send_message(p_chat_id BIGINT, p_content_text TEXT)`
**Purpose**: Sends a text message to a chat
**Security**: Validates user is chat participant
**Features**:
- Updates chat's updated_at timestamp
- Triggers score increment
**Returns**: `BIGINT` (message_id)

#### `get_chat_messages(p_chat_id BIGINT, p_limit INTEGER DEFAULT 50)`
**Purpose**: Retrieves messages for a specific chat
**Security**: Validates user is chat participant
**Features**:
- Applies TTL policy (unread or read within 24 hours)
- Includes sender information
- Marks user's own messages
**Returns**: Table with message details

#### `get_total_unread_count()`
**Purpose**: Gets total unread message count for current user
**Returns**: `INTEGER`

#### `send_media_to_friends(p_storage_path TEXT, p_content_type TEXT, p_recipient_ids UUID[])`
**Purpose**: Sends media file to multiple friends atomically
**Features**:
- Creates direct chats with each recipient
- Inserts media message for each chat
- Updates chat timestamps

---

## Real-time Features

### Enabled Tables
- `public.messages` - For live message updates

### PostgreSQL Notifications
- `message_read` - Notified when messages are marked as viewed

---

## Triggers

### Automatic Timestamps
- `profiles_updated_at` - Updates `updated_at` on profile changes
- `friendships_updated_at` - Updates `updated_at` on friendship changes
- `chats_updated_at` - Updates `updated_at` on chat changes

### User Creation
- `on_auth_user_created` - Automatically creates profile when auth user is created

### Scoring System
- `messages_increment_score` - Awards 5 points for sending messages
- `stories_increment_score` - Awards 10 points for posting stories

---

## Data Relationships

```
auth.users (1) ──────── (1) profiles
    │
    └── friendships (M:M self-relation)
            │
            └── user_id_1, user_id_2
    
profiles (M) ──────── (M) chats
    │                    │
    └── chat_participants └── messages (1:M)
    │                           │
    └── stories (1:M)           └── storage_path → media bucket
            │
            └── storage_path → media bucket
```

---

## Security Model

### Row Level Security (RLS)
All tables have RLS enabled with policies that:
- Use `auth.uid()` to identify current user
- Restrict access to user's own data or data they have permission to see
- Implement friend-based visibility for social features

### Content Expiration (TTL)
- **Messages**: Visible until 24 hours after being `viewed_at`
- **Stories**: Visible for 24 hours after `created_at`
- **Implementation**: RLS policies provide instant invisibility, scheduled cleanup provides permanent deletion

### Permission Model
- **Public**: Profiles (username, score)
- **Friends Only**: Private stories, direct messaging
- **Self Only**: Profile updates, friend request responses
- **Authenticated**: Public stories, friend requests, user search

---

## TypeScript Types

The schema is reflected in TypeScript interfaces:

```typescript
// Core entities
interface User { id: string; email: string; username: string; score: number; ... }
interface Message { id: number; sender_id: string; content_type: string; ... }
interface Conversation { chat_id: number; other_user_id: string; unread_count: number; ... }
interface CapturedMedia { uri: string; type: 'photo' | 'video'; ... }

// Friend management
interface FriendRequest { id: number; status: 'pending' | 'accepted' | 'blocked'; ... }
interface Friend { id: string; username: string; score: number; }
```

---

## Performance Considerations

### Indexes
- Strategic indexes on frequently queried columns
- Composite indexes for complex queries (friendships, chat participants)
- Partial indexes for TTL queries (messages.viewed_at)

### Query Optimization
- Database functions reduce client-server round trips
- Efficient CTEs in conversation listing
- Proper LIMIT usage for pagination

### Storage
- Media files stored in Supabase Storage with access control
- File cleanup handled by storage policies
- Efficient file naming with timestamps