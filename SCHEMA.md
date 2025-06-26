# Database Schema Documentation

This document provides a comprehensive overview of the SnapConnect database
schema, including tables, relationships, functions, and security policies.

## Overview

SnapConnect uses **Supabase** (PostgreSQL) as its backend database with the
following key features:

- **Row Level Security (RLS)** for data protection
- **Ephemeral content** with 24-hour TTL policies
- **Real-time subscriptions** for live messaging
- **Automated scoring system** via database triggers
- **Secure functions** for complex operations

---

## Core Tables

### 1. `auth.users` (Supabase Auth)

**Purpose**: Authentication and user account management (managed by Supabase
Auth)

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
- `Users can update their own username` - Users can update only their own
  username

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

- `Users can view their own friendships` - Users see friendships they're
  involved in
- `Users can send friend requests` - Users can insert pending requests
- `Users can respond to friend requests` - Recipients can update request status
- `Users can delete their friendships` - Either party can delete the friendship

### 4. `public.chats`

**Purpose**: Chat conversation metadata

```sql
CREATE TABLE public.chats (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  chat_type TEXT NOT NULL DEFAULT 'direct'
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

- `Users can view their own chat participation records` - Users can see their own entry in the table. This is non-recursive and safe.
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

- `Users can view messages in their chats with TTL` - Complex policy
  implementing:
  - User must be chat participant
  - Unread messages never expire (`viewed_at IS NULL`)
  - Read messages expire after 24 hours
    (`viewed_at > NOW() - INTERVAL '24 hours'`)
- `Users can send messages to their chats` - Users can insert messages to their
  chats

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

### 8. `public.story_views`

**Purpose**: Tracks which users have viewed which stories.

```sql
CREATE TABLE public.story_views (
    story_id BIGINT NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    PRIMARY KEY (story_id, user_id)
);
```

**Indexes:**

- `story_views_user_id_idx` on `user_id`

**RLS Policies:**

- `Users can view their own story views` - Users can only see their own view records.
- `Users can insert their own story views` - Users can only insert view records for themselves.

---

## Storage Buckets

### `media` Bucket

**Purpose**: Stores uploaded images and videos for messages and stories

**Storage Policies:**

- `Allow authenticated uploads` - Any authenticated user can upload to the `media` bucket.
- `Allow authenticated read access to media` - Users can view media if:
    1. They are the owner of the media object.
    2. They are a participant in a chat where the media was sent.
    3. They have access to view a story containing the media (respects story RLS).

---

## Database Functions

### User & Friend Management

#### `update_username(new_username TEXT)`
- **Purpose**: Securely updates a user's username with validation.
- **Security**: `DEFINER`
- **Validation**: Checks for length (3-30), format (alphanumeric, underscore), and uniqueness.

#### `accept_friend_request(request_id BIGINT)`
- **Purpose**: Accepts a pending friend request.
- **Security**: `DEFINER`. Checks that the caller is the recipient of the request.

#### `decline_friend_request(request_id BIGINT)`
- **Purpose**: Declines and deletes a pending friend request.
- **Security**: `DEFINER`. Checks that the caller is the recipient.

#### `get_suggested_friends(limit_count INTEGER)`
- **Purpose**: Returns a list of random users who are not already friends with the current user.
- **Security**: `DEFINER`.

### Chat & Messaging

#### `get_or_create_direct_chat(p_user_id1 uuid, p_user_id2 uuid)`
- **Purpose**: Finds an existing direct chat between two users or creates a new one if it doesn't exist. Prevents duplicate chat rooms.
- **Security**: `DEFINER`.
- **Returns**: `BIGINT` (the `chat_id`).

#### `send_message(p_chat_id BIGINT, p_content_text TEXT)`
- **Purpose**: Sends a text message to a specified chat.
- **Security**: `DEFINER`. Verifies that the sender is a participant of the chat.

#### `send_media_to_friends(p_storage_path TEXT, p_content_type TEXT, p_recipient_ids UUID[])`
- **Purpose**: Sends a media message (image/video) to multiple friends simultaneously. It finds or creates a direct chat with each recipient and inserts the message.
- **Security**: `DEFINER`.

#### `mark_messages_as_viewed(p_chat_id BIGINT)`
- **Purpose**: Marks all unread messages in a chat as read by the current user. Also broadcasts a `message_read` notification via `pg_notify`.
- **Security**: `DEFINER`.

#### `get_user_conversations()`
- **Purpose**: Fetches the user's complete list of conversations. Includes friends with no chat history.
- **Returns**: A table including `chat_id`, `other_user_id`, `other_username`, last message details, and `unread_count`.
- **Security**: `DEFINER`.

#### `get_chat_messages(p_chat_id BIGINT, p_limit INTEGER)`
- **Purpose**: Fetches a paginated list of messages for a specific chat.
- **Security**: `DEFINER`. Verifies the user is a participant.

#### `get_total_unread_count()`
- **Purpose**: Returns the total number of unread messages for the current user across all chats.
- **Security**: `DEFINER`.
- **Returns**: `INTEGER`.

### Stories

#### `post_story(p_storage_path TEXT, p_media_type TEXT, p_privacy TEXT)`
- **Purpose**: Creates a new story record in the database.
- **Security**: `DEFINER`.
- **Validation**: Checks for valid `media_type` and `privacy` settings.

#### `get_stories_feed()`
- **Purpose**: Fetches the stories feed, grouped by author. It respects all RLS policies.
- **Returns**: A `JSON` object containing an array of authors, each with their username and a list of their stories. Each story includes an `is_viewed` flag, and each author group has an `all_stories_viewed` flag.
- **Security**: `INVOKER`.

#### `mark_story_viewed(p_story_id BIGINT)`
- **Purpose**: Marks a story as viewed by the current user. Inserts a record into the `story_views` table.
- **Security**: `INVOKER`. It will only mark a story as viewed if the user has permission to see it.

---

## Database Triggers

### `handle_new_user()`
- **Event**: `AFTER INSERT ON auth.users`
- **Purpose**: Automatically creates a new `profile` record when a new user signs up in Supabase Auth. It intelligently generates a unique username based on the user's metadata or email.

### `handle_updated_at()`
- **Event**: `BEFORE UPDATE` on `profiles`, `friendships`, `chats`
- **Purpose**: Automatically updates the `updated_at` timestamp on any row that is modified.

### `increment_score_on_message()`
- **Event**: `AFTER INSERT ON public.messages`
- **Purpose**: Awards the sender **5 points** by calling `increment_user_score` every time they send a message.

### `increment_score_on_story()`
- **Event**: `AFTER INSERT ON public.stories`
- **Purpose**: Awards the author **10 points** by calling `increment_user_score` every time they post a new story.

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
- **Implementation**: RLS policies provide instant invisibility, scheduled
  cleanup provides permanent deletion

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
