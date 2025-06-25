# Technical Architecture: SnapConnect Messenger

- **Version**: 1.0
- **Author**: Gemini Architect
- **Status**: Final

## 1. Overview

This document outlines the technical architecture for the SnapConnect Messenger
application. The backend is built entirely on the Supabase platform, providing a
scalable, secure, and real-time foundation for a mobile-first social messenger.
The architecture prioritizes a secure-by-default posture using Row Level
Security (RLS) and efficient data management for the application's core
requirement of ephemeral content.

This design covers the foundational features: User Authentication, Profiles,
Friend Management, Real-Time Chat, and Ephemeral Stories (Photo & Video).

## 2. Technology Stack

The backend leverages the following integrated Supabase services:

- **Supabase Auth**: For user sign-up, login, and JWT-based session management.
- **Supabase Database (Postgres)**: The primary relational database for storing
  all application data, including user profiles, relationships, and message
  metadata.
- **Supabase Storage**: For storing all user-generated media (photos and videos
  for messages and stories).
- **Supabase Realtime**: For broadcasting and receiving chat messages instantly.
- **Supabase Edge Functions (Deno)**: For scheduled server-side tasks,
  specifically for data cleanup.

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

## 5. Server-Side Components

### 5.1. Database Functions

- **`function update_user_score(user_id uuid, points integer)`**: A reusable
  `pl/pgsql` function that safely increments a user's score.
- **`function suggest_users(user_id uuid, count integer)`**: Returns a set of
  random users that the given `user_id` is not already friends with.
- **`function send_media_to_friends(storage_path text, content_type text, recipient_ids uuid[])`**:
  Handles the transactional sending of a media message to multiple recipients.
  It iterates through the recipient IDs, finds or creates a direct chat for
  each, and inserts the message metadata into the `messages` table. This is
  invoked via RPC from the client.

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
