# Feature Plan: Real-Time Chat & Messaging

- **Version**: 1.0
- **Status**: Planning

## 1. Feature Summary & Key Decisions

This document outlines the implementation plan for the core real-time chat
functionality in SnapConnect. This feature will enable one-on-one, ephemeral
text messaging between users. The plan is based on the technical architecture
and product requirements, incorporating key decisions made during our planning
session.

### Key Decisions Recap:

- **Scope (MVP)**: The initial version will support one-on-one text-only
  conversations. The backend will be built to support `image` and `video`
  message types for future implementation.
- **Content Expiration**: To create a sense of urgency and align with the app's
  ephemeral nature, private chat messages will expire and be permanently deleted
  24 hours after they are **viewed** by the recipient. Unread messages will not
  expire.
- **"Viewed" Status**: The `messages` table in the database will be updated with
  a `viewed_at` timestamp column to track when a message is read. In the UI,
  this will be communicated through changes in icon style and status text.
- **Backend Logic**:
  - **Data Fetching**: A dedicated Postgres function (`get_user_conversations`)
    will be created to efficiently query all the data needed for the main chat
    list screen.
  - **Marking as Read**: A separate Postgres function
    (`mark_messages_as_viewed`), callable via RPC, will handle the logic for
    updating a message's `viewed_at` status.
- **Real-Time Functionality**: The implementation will heavily leverage Supabase
  Realtime:
  - **New Messages**: The UI will update instantly via subscriptions to Postgres
    Changes on the `messages` table.
  - **Read Receipts**: A custom event (`MESSAGE_READ`) will be broadcast using
    `pg_notify` when messages are marked as read, allowing the sender's UI to
    update in real-time.
- **Client-Side Implementation**: The `supabase-js` library will manage the
  WebSocket connection, and React Native components will use `useEffect` hooks
  to subscribe to channels and manage the lifecycle of the real-time
  subscriptions.

- **Photo & Video Messages**: The chat feature now fully supports sending and
  receiving ephemeral photo and video messages. For a detailed breakdown of this
  feature, see the
  [Photo & Video Messaging Feature Plan](./photo-video-messaging.md).

## 2. UI/UX Breakdown

### Chat List Screen (`screens/ChatScreen`)

This screen will display a list of all active conversations, sorted by the most
recent activity (either a new message or a new friendship).

#### Conversation List Item Component

Each item in the list will represent one conversation and must display dynamic
information based on the last message's status.

| Priority | Status Description            | Condition                                                                  | Icon Name (`Feather`) | Icon State | Icon Color      | Status Text   |
| :------- | :---------------------------- | :------------------------------------------------------------------------- | :-------------------- | :--------- | :-------------- | :------------ |
| 1        | **New Message (Unread)**      | Last message was **received** AND current user has not opened it.          | `message-square`      | Filled     | `primary`       | "New Message" |
| 2        | **Message Sent (Delivered)**  | Last message was **sent** by current user AND recipient has not opened it. | `send`                | Filled     | `accent`        | "Sent"        |
| 3        | **Message Read by Recipient** | Last message was **sent** by current user AND recipient has opened it.     | `send`                | Outline    | `accent`        | "Opened"      |
| 4        | **Message Read by You**       | Last message was **received** AND current user has opened it.              | `message-square`      | Outline    | `text`          | "Received"    |
| 5        | **New Friend (No History)**   | Friendship exists but no messages have been exchanged.                     | `message-square`      | Outline    | `textSecondary` | "Tap to chat" |

## 3. Implementation Tasks

### Backend Tasks

| Priority | Task                                         | Implementation Details                                                                                                                                                                                                                                                     | Code Pointers                                             | Dependencies  | Status        |
| :------- | :------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------- | :------------ | :------------ |
| **1**    | Update Database Schema                       | Add a nullable `viewed_at` timestamp column to the `messages` table. This is essential for tracking the 24-hour expiration rule based on when a message is viewed.                                                                                                         | `supabase/migrations/` (new migration file)               | -             | `Not Started` |
| **2**    | Create DB Function `get_user_conversations`  | Write a `pl/pgsql` function that takes a `user_id` and returns a list of conversations, including the other participant's username, the content of the last message, its `created_at` timestamp, its `sender_id`, and its `viewed_at` status. Sorted by last message time. | `supabase/migrations/` (new migration file)               | Schema Update | `Not Started` |
| **3**    | Create DB Function `mark_messages_as_viewed` | Write a `pl/pgsql` function (`SECURITY DEFINER`) that accepts a `chat_id` and `user_id`, then updates the `viewed_at` timestamp for all messages in that chat where the `sender_id` is NOT the provided `user_id` and `viewed_at` is NULL.                                 | `supabase/migrations/` (new migration file)               | Schema Update | `Not Started` |
| **4**    | Implement Real-Time Read Receipts            | In the `mark_messages_as_viewed` function, after the `UPDATE` statement, use `pg_notify` to broadcast a JSON payload like `('message_read', '{"chat_id": 123, "viewed_by": "user-uuid"}')`.                                                                                | `supabase/migrations/` (within `mark_messages_as_viewed`) | Task #3       | `Not Started` |
| **5**    | Update Row Level Security (RLS) Policies     | Modify the `SELECT` policy on the `messages` table. A user can see a message if they are a participant in the chat AND (`viewed_at` is NULL OR `now() - viewed_at < '24 hours'::interval`).                                                                                | `supabase/migrations/` (new migration file)               | Schema Update | `Not Started` |

### Frontend Tasks

| Priority | Task                                      | Implementation Details                                                                                                                                                                                                        | Code Pointers                              | Dependencies    | Status        |
| :------- | :---------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------- | :-------------- | :------------ |
| **1**    | Update Types                              | Add/update TypeScript types for `Conversation` (based on the return type of the new DB function) and `Message` (to include `viewed_at`).                                                                                      | `src/types/`                               | -               | `Not Started` |
| **2**    | Create Chat Service                       | Create a new service file for all chat-related backend calls. This service will encapsulate all interactions with Supabase for the chat feature.                                                                              | `src/services/chat.ts`                     | Backend Done    | `Not Started` |
| **3**    | Implement `getConversations` in Service   | Add a function to the chat service that calls the `get_user_conversations` Postgres function using `supabase.rpc()`.                                                                                                          | `src/services/chat.ts`                     | Backend Task #2 | `Not Started` |
| \*_4_    | Implement `markMessagesAsRead` in Service | Add a function that calls the `mark_messages_as_viewed` Postgres function using `supabase.rpc()`.                                                                                                                             | `src/services/chat.ts`                     | Backend Task #3 | `Not Started` |
| **5**    | Build `ConversationListItem` Component    | Create a new reusable component that implements the UI logic defined in the table above. It will take a `Conversation` object as a prop and render the avatar, username, and dynamic status icon/text.                        | `src/components/ConversationListItem/`     | Types Update    | `Not Started` |
| **6**    | Implement `ChatListScreen`                | - Fetch conversations using the chat service. <br>- Display the list using `FlatList` and the `ConversationListItem` component. <br>- Implement navigation to `ConversationScreen` on tap, passing the `chat_id`.             | `src/screens/ChatScreen/index.tsx`         | Tasks #3, #5    | `Not Started` |
| **7**    | Implement `ConversationScreen` UI         | - Create the basic UI with a `FlatList` for messages and a `TextInput` for sending new messages. <br>- Fetch initial messages for the given `chat_id`.                                                                        | `src/screens/ConversationScreen/index.tsx` | -               | `Not Started` |
| **8**    | Implement Real-Time Messaging             | In `ConversationScreen`, use `useEffect` to subscribe to new messages for the current chat using Supabase Realtime (`postgres_changes`). Update component state when a new message arrives.                                   | `src/screens/ConversationScreen/index.tsx` | Task #7         | `Not Started` |
| **9**    | Implement Marking Messages as Read        | In `ConversationScreen`, when the component mounts or becomes focused, call the `markMessagesAsRead` service function.                                                                                                        | `src/screens/ConversationScreen/index.tsx` | Task #4, #7     | `Not Started` |
| **10**   | Implement Real-Time Read Receipts         | In `ConversationScreen`, subscribe to the custom `message_read` event from the Realtime channel. When the event is received for the current chat, re-fetch messages or update the local state to reflect the "Opened" status. | `src/screens/ConversationScreen/index.tsx` | Task #8         | `Not Started` |
