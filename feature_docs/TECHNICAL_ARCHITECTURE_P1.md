# Technical Architecture: SnapConnect Messenger

- **Version**: 2.0
- **Author**: Gemini Architect + AI Implementation
- **Status**: Updated with AI Features

## 1. Overview

This document outlines the technical architecture for the SnapConnect Messenger
application. The backend is built on the Supabase platform with **AI-powered RAG
(Retrieval-Augmented Generation) capabilities**, providing a scalable, secure,
and real-time foundation for a mobile-first social messenger with intelligent
financial insights.

The architecture prioritizes a secure-by-default posture using Row Level
Security (RLS) and efficient data management for the application's core
requirement of ephemeral content and AI-powered financial analysis.

This design covers the foundational features: User Authentication, Profiles,
Friend Management, Real-Time Chat, Ephemeral Stories (Photo & Video), and **AI
Chat with RAG Integration**.

## 2. Technology Stack

The backend leverages the following integrated services:

### Core Platform (Supabase)

- **Supabase Auth**: For user sign-up, login, and JWT-based session management.
- **Supabase Database (Postgres)**: The primary relational database for storing
  all application data, including user profiles, relationships, message
  metadata, and **AI conversation data**.
- **Supabase Storage**: For storing all user-generated media (photos and videos
  for messages and stories).
- **Supabase Realtime**: For broadcasting and receiving chat messages instantly.
- **Supabase Edge Functions**: For scheduled server-side tasks, specifically for
  data cleanup.

### AI Infrastructure

- **Node.js TypeScript API**: Custom API endpoint for RAG functionality
- **OpenAI GPT-4o-mini**: Language model for generating financial insights
- **Pinecone Vector Database**: Vector storage and similarity search for EDGAR
  filings
- **SEC EDGAR Data**: Corporate filings providing financial context for AI
  responses

## 3. Database Schema

The database is structured to be relational, normalized, and secure. All tables
exist within the `public` schema.

### Table: `profiles`

Stores public user data and is linked one-to-one with `auth.users`.

| Column Name  | Data Type     | Constraints                        | Description                                |
| :----------- | :------------ | :--------------------------------- | :----------------------------------------- |
| `id`         | `uuid`        | Primary Key, FK to `auth.users.id` | The user's unique ID from the auth system. |
| `username`   | `text`        | Unique, Not Null                   | The user's unique, public-facing username. |
| `created_at` | `timestamptz` | Not Null, Default `now()`          | Timestamp of profile creation.             |
| `score`      | `integer`     | Not Null, Default `0`              | The user's gamified engagement score.      |

### Table: `friendships`

Manages the relationships and friend requests between users.

| Column Name  | Data Type     | Constraints                              | Description                                    |
| :----------- | :------------ | :--------------------------------------- | :--------------------------------------------- |
| `id`         | `bigint`      | Primary Key (auto-incrementing)          | Unique ID for the friendship record.           |
| `user_id_1`  | `uuid`        | FK to `profiles.id`                      | The ID of the user who initiated the request.  |
| `user_id_2`  | `uuid`        | FK to `profiles.id`                      | The ID of the user who received the request.   |
| `status`     | `text`        | Check (`pending`, `accepted`, `blocked`) | The current status of the relationship.        |
| `created_at` | `timestamptz` | Not Null, Default `now()`                | Timestamp of when the request was sent.        |
| `updated_at` | `timestamptz` | Not Null, Default `now()`                | Timestamp of when the status was last updated. |

### Table: `chats` & `chat_participants`

A standard many-to-many structure to enable one-on-one and potential group
chats.

**`chats`** | Column Name | Data Type | Constraints | Description | | :--- |
:--- | :--- | :--- | | `id` | `bigint` | Primary Key | Unique ID for the chat
conversation. | | `created_at` | `timestamptz` | Not Null, Default `now()` |
Timestamp of conversation creation. |

**`chat_participants`** | Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- | | `chat_id` | `bigint` | FK to `chats.id` | The
chat this entry belongs to. | | `user_id` | `uuid` | FK to `profiles.id` | The
user who is a participant. | | _Composite Primary Key on (`chat_id`, `user_id`)_
| | |

### Table: `messages`

Stores metadata for all chat messages.

| Column Name    | Data Type     | Constraints                      | Description                                  |
| :------------- | :------------ | :------------------------------- | :------------------------------------------- |
| `id`           | `bigint`      | Primary Key                      | Unique ID for the message.                   |
| `chat_id`      | `bigint`      | FK to `chats.id`                 | The conversation this message belongs to.    |
| `sender_id`    | `uuid`        | FK to `profiles.id`              | The user who sent the message.               |
| `content_type` | `text`        | Check (`text`, `image`, `video`) | Type of content in the message.              |
| `content_text` | `text`        | Nullable                         | The text of the message (if `text`).         |
| `storage_path` | `text`        | Nullable                         | The path to media in Supabase Storage.       |
| `created_at`   | `timestamptz` | Not Null, Default `now()`        | Timestamp when the message was sent.         |
| `viewed_at`    | `timestamptz` | Nullable                         | Timestamp when the message was first viewed. |

### Table: `stories`

Stores metadata for each story posted by a user.

| Column Name    | Data Type     | Constraints                         | Description                             |
| :------------- | :------------ | :---------------------------------- | :-------------------------------------- |
| `id`           | `bigint`      | Primary Key                         | Unique ID for the story.                |
| `author_id`    | `uuid`        | FK to `profiles.id`                 | The user who created the story.         |
| `storage_path` | `text`        | Not Null                            | The path to the photo/video in Storage. |
| `privacy`      | `text`        | Check (`public`, `private_friends`) | The visibility of the story.            |
| `created_at`   | `timestamptz` | Not Null, Default `now()`           | Timestamp used for the TTL policy.      |

### AI Tables

The following tables support the AI-powered chat and feed functionality.

### Table: `ai_conversations`

Stores AI chat conversation metadata with user-defined titles.

| Column Name  | Data Type     | Constraints                               | Description                          |
| :----------- | :------------ | :---------------------------------------- | :----------------------------------- |
| `id`         | `uuid`        | Primary Key, Default `gen_random_uuid()`  | Unique ID for the AI conversation.   |
| `user_id`    | `uuid`        | FK to `profiles.id`, Not Null             | The user who owns this conversation. |
| `title`      | `text`        | Not Null, Default 'untitled conversation' | User-editable conversation title.    |
| `created_at` | `timestamptz` | Not Null, Default `now()`                 | Timestamp of conversation creation.  |

### Table: `ai_messages`

Stores individual messages within AI conversations.

| Column Name       | Data Type     | Constraints                              | Description                               |
| :---------------- | :------------ | :--------------------------------------- | :---------------------------------------- |
| `id`              | `uuid`        | Primary Key, Default `gen_random_uuid()` | Unique ID for the AI message.             |
| `conversation_id` | `uuid`        | FK to `ai_conversations.id`, Not Null    | The conversation this message belongs to. |
| `sender`          | `text`        | Check (`user`, `ai`), Not Null           | Whether message is from user or AI.       |
| `content`         | `text`        | Not Null                                 | The message content.                      |
| `created_at`      | `timestamptz` | Not Null, Default `now()`                | Timestamp when the message was sent.      |

### Table: `ai_posts`

Stores AI-generated content shared to public/friend feeds.

| Column Name       | Data Type     | Constraints                              | Description                                 |
| :---------------- | :------------ | :--------------------------------------- | :------------------------------------------ |
| `id`              | `uuid`        | Primary Key, Default `gen_random_uuid()` | Unique ID for the AI post.                  |
| `user_id`         | `uuid`        | FK to `profiles.id`, Not Null            | The user who created this post.             |
| `user_commentary` | `text`        | Nullable                                 | User's commentary on the AI response.       |
| `ai_response`     | `text`        | Not Null                                 | The AI-generated content being shared.      |
| `source_link`     | `text`        | Nullable                                 | Link to source material (e.g., SEC filing). |
| `privacy`         | `text`        | Check (`public`, `friends`), Not Null    | Visibility of the post.                     |
| `created_at`      | `timestamptz` | Not Null, Default `now()`                | Timestamp of post creation.                 |

## 4. Core Backend Logic

### 4.1. Security Model: Row Level Security (RLS)

The system is secure by default. RLS is enabled on all tables, and access is
granted only through explicit policies.

- **Authentication**: All policies rely on `auth.uid()` to identify the current
  user from their JWT.
- **Ownership**: Users can only update or delete records they own (e.g., their
  own profile).
- **Relationship-Based Access**: Access to shared content like `messages` and
  `friendships` is granted only if the requesting user is a valid participant.
- **Example (`stories` SELECT Policy)**: A user can see a story if
  `story.created_at` is within 24 hours AND (`story.privacy` is 'public' OR the
  user is an accepted friend of `story.author_id`). For private `messages`, a
  similar policy will grant access only if the message has not yet been viewed,
  or if it has been viewed within the last 24 hours (i.e.,
  `now() - viewed_at < '24 hours'::interval`).
- **Storage Access**: Policies on the `storage.objects` table ensure that users
  can only upload to designated buckets (e.g., `media`) and can only access
  media objects if they have a corresponding record in the `messages` or
  `stories` table that they are authorized to view.

### 4.2. Content Expiration: Hybrid TTL Model

A two-part system ensures content disappears reliably and the system remains
performant.

1.  **Instant Invisibility**: RLS policies on `messages` and `stories` prevent
    users from selecting any expired rows. This provides the exact user
    experience of content disappearing on time.
    - For `stories`, policies hide rows where `created_at` is older than 24
      hours.
    - For private `messages`, policies hide rows where `viewed_at` is not null
      and is older than 24 hours. Unread messages remain visible indefinitely
      until read.
2.  **Permanent Deletion**: A scheduled Supabase Edge Function (`daily_cleanup`)
    runs once per day to permanently delete data and associated files from
    Storage that are older than 24 hours. This prevents data accumulation and
    keeps storage costs manageable.
    - The job deletes `stories` where `created_at` is older than 24 hours.
    - The job also deletes `messages` where `viewed_at` is not null and is older
      than 24 hours.

### 4.3. User Score Logic

The user score is updated automatically using Postgres triggers for maximum
efficiency.

- **On `messages` Insert**: A trigger executes a database function
  (`update_user_score(sender_id, 5)`).
- **On `stories` Insert**: A trigger executes the same function
  (`update_user_score(author_id, 10)`).
- The `update_user_score` function runs with `SECURITY DEFINER` permissions to
  atomically update the `score` in the `profiles` table.

### 4.4. Real-Time Chat

- **Broadcasting**: When a message is inserted, a database trigger or the
  backend service will send the new message payload to a Supabase Realtime
  channel.
- **Channels**: Channel names are specific to a conversation (e.g., `chat:123`).
- **Subscribing**: The client application subscribes to the relevant channels to
  receive messages instantly without needing to poll the database.

### 4.5. AI-Powered RAG System

The AI system provides financial insights through a Retrieval-Augmented
Generation (RAG) architecture.

#### Architecture Components:

1. **Vector Database (Pinecone)**: Stores embeddings of SEC filing content for
   similarity search
2. **Node.js API Endpoint**: Handles RAG queries with context retrieval and AI
   generation
3. **OpenAI Integration**: Uses GPT-4o-mini for generating contextual financial
   insights
4. **Conversation Persistence**: Automatically saves user queries and AI
   responses

#### RAG Process Flow:

1. **User Query**: User sends financial question via chat interface
2. **Context Retrieval**: Query is embedded and used to search Pinecone for
   relevant SEC filing content
3. **Context Augmentation**: Retrieved filing excerpts are combined with user
   query
4. **AI Generation**: OpenAI generates response using retrieved context and
   financial expertise
5. **Response Delivery**: AI response is returned to user and saved to
   conversation history
6. **Sharing Options**: Users can share AI responses to feeds or send to friends

#### Security & RLS for AI Tables:

- **ai_conversations**: Users can only access their own conversations
- **ai_messages**: Messages are filtered by conversation ownership
- **ai_posts**: Public posts visible to all, friend posts visible to accepted
  friends only

## 5. Server-Side Components

### 5.1. Database Functions

#### Core Functions

- **`function update_user_score(user_id uuid, points integer)`**: A reusable
  `pl/pgsql` function that safely increments a user's score.
- **`function suggest_users(user_id uuid, count integer)`**: Returns a set of
  random users that the given `user_id` is not already friends with.
- **`function send_media_to_friends(storage_path text, content_type text, recipient_ids uuid[])`**:
  Handles the transactional sending of a media message to multiple recipients.
  It iterates through the recipient IDs, finds or creates a direct chat for
  each, and inserts the message metadata into the `messages` table. This is
  invoked via RPC from the client.

#### AI Functions

- **`function get_user_ai_conversations(user_uuid uuid)`**: Returns all AI
  conversations for a user with metadata including message count and last
  activity timestamp.
- **`function get_ai_conversation_messages(conv_id uuid)`**: Fetches all
  messages for a specific AI conversation, ordered chronologically.
- **`function update_ai_conversation_title(conv_id uuid, new_title text)`**:
  Allows users to update the title of their AI conversations.
- **`function create_ai_conversation(user_uuid uuid, title text)`**: Creates a
  new AI conversation with optional custom title.
- **`function add_ai_message(conv_id uuid, sender_type text, content text)`**:
  Adds messages (user or AI) to conversations with validation.
- **`function get_public_feed(limit_count integer, offset_count integer)`**:
  Returns paginated public AI posts with user profile information.
- **`function get_friend_feed(user_uuid uuid, limit_count integer, offset_count integer)`**:
  Returns paginated AI posts from user's accepted friends.
- **`function create_ai_post(user_uuid uuid, user_commentary text, ai_response text, source_url text, privacy_setting text)`**:
  Creates new AI posts for sharing insights to feeds.

### 5.2. Edge Functions

- **`function daily-cleanup()`**: A Deno function scheduled via `pg_cron`.
  - **Trigger**: Runs on a schedule (e.g., daily at midnight).
  - **Action**:
    1. Queries for all `messages` and `stories` with a `created_at` older than
       24 hours.
    2. Extracts the `storage_path` from each record.
    3. Issues commands to Supabase Storage to delete the files at those paths.
    4. Deletes the records from the database tables.

## 6. API & Client Interaction

(High-Level view, as frontend is not in scope)

The client application will interact with the backend primarily through the
Supabase client libraries (`supabase-js`).

- **Auth**: Use `supabase.auth.signUp()` and
  `supabase.auth.signInWithPassword()`.
- **Data**: Use `supabase.from('table').select/insert/update/delete()` to
  interact with data. RLS policies will automatically filter results.
- **Realtime**: Use `supabase.channel('channel-name').subscribe()` to listen for
  events.
- **Functions**: Use `supabase.functions.invoke()` to call Edge Functions if any
  client-invokable functions are needed in the future.
