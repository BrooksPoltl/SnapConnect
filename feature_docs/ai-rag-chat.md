# AI RAG Chat & Feed Feature Plan

This feature introduces an AI-powered chat interface, user-titled conversation history, and public/friend-only feeds for sharing insights.

### Backend - AI Posts & Feeds

| Priority | Task Description | Implementation Details | Code Pointers | Dependencies | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **High** | Create `ai_posts` table | Create table to store public posts. Columns: `id`, `user_id`, `user_commentary`, `ai_response`, `source_link`, `created_at`, and `privacy` ('public' or 'friends'). | `supabase/migrations/` | None | To Do |
| **High** | Create `get_public_feed` RPC | Fetches posts where `privacy = 'public'`. Paginated. Joins with `profiles`. | `supabase/migrations/` | `ai_posts` table | To Do |
| **High** | Create `get_friend_feed` RPC | Fetches posts where `privacy = 'friends'` AND the author is in the current user's friend list. Paginated. | `supabase/migrations/` | `ai_posts` table, Friends logic | To Do |
| **High** | Create `create_ai_post` RPC | Allows an authenticated user to insert a record into `ai_posts`, accepting a `privacy` parameter. | `supabase/migrations/` | `ai_posts` table | To Do |

### Backend - AI Conversation History

| Priority | Task Description | Implementation Details | Code Pointers | Dependencies | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **High** | Create `ai_conversations` table | Stores chat session metadata. Columns: `id`, `user_id`, `title` (TEXT, `default 'untitled conversation'`), `created_at`. | `supabase/migrations/` | None | To Do |
| **High** | Create `ai_messages` table | Stores each message in a conversation. Columns: `id`, `conversation_id`, `sender` ('user' or 'ai'), `content`, `created_at`. | `supabase/migrations/` | `ai_conversations` table | To Do |
| **High** | RLS Policies for new tables | Secure `ai_conversations` and `ai_messages` so a user can only access their own data. | `supabase/migrations/` | New tables | To Do |
| **High** | Create `get_user_ai_conversations` RPC | Fetches all of the current user's conversation threads from `ai_conversations`. | `supabase/migrations/` | `ai_conversations` table | To Do |
| **High** | Create `get_ai_conversation_messages` RPC | Fetches all messages for a given `conversation_id`, ordered by `created_at`. | `supabase/migrations/` | `ai_messages` table | To Do |
| **Medium**| Create `update_ai_conversation_title` RPC | Creates a function to allow a user to update the title of their own conversation. | `supabase/migrations/` | `ai_conversations` table | To Do |

### Frontend

| Priority | Task Description | Implementation Details | Code Pointers | Dependencies | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **High** | Create AI Service & Types | Create `src/services/ai.ts` for all AI-related functions and `src/types/ai.ts` for data models. | `src/services/ai.ts`, `src/types/ai.ts` | Backend RPCs | To Do |
| **High** | Rename `MapScreen` -> `AIHomeScreen` | This screen will list past conversations. | `src/screens/MapScreen` -> `src/screens/AIHomeScreen` | None | To Do |
| **High** | Rename `SpotlightScreen` -> `FeedScreen` | This screen will house the public and friend feeds. | `src/screens/SpotlightScreen` -> `src/screens/FeedScreen` | None | To Do |
| **High** | Update Root Navigation | Replace `MapScreen` and `SpotlightScreen` with `AIHomeScreen` and `FeedScreen`. | `src/navigation/RootNavigation.tsx` | Screen renaming | To Do |
| **High** | Build `AIHomeScreen` UI | Display a list of AI conversations. A "New Chat" button navigates to `AIChatScreen`. | `src/screens/AIHomeScreen/index.tsx` | `get_user_ai_conversations` | To Do |
| **High** | Create `AIChatScreen` | Contains the chat UI for a single conversation. It will have an editable title field in the header. | `src/screens/AIChatScreen/index.tsx` | `AIHomeScreen` | To Do |
| **High** | Build `FeedScreen` UI | Add tabs for "Public" and "Friends" feeds, displaying posts from the respective service calls. | `src/screens/FeedScreen/index.tsx` | `get_public_feed`, `get_friend_feed` | To Do |
| **Medium**| Implement Conversation Title Editing | In `AIChatScreen`, allow the user to tap the header to edit the title. Calls `update_ai_conversation_title` service. Defaults to 'untitled conversation' on new chats. | `src/screens/AIChatScreen/index.tsx` | `AIChatScreen` UI | To Do |
| **Medium**| Implement "Share" Flow | An AI message "Share" button opens a modal with options: "Post to Feed" or "Send to a Friend". | `src/screens/AIChatScreen/index.tsx` | `AIChatScreen` UI | To Do |
| **Medium**| Create `CreateAIPostScreen` | Navigated to from "Post to Feed". Includes a privacy toggle, commentary input, and quoted AI response. | `src/screens/CreateAIPostScreen/index.tsx` | "Share" Flow | To Do |
| **Medium**| Update "Send to Friend" Flow | "Send to a Friend" navigates to `SelectRecipientsScreen` to send the AI response text. | `src/screens/AIChatScreen/index.tsx` | "Share" Flow | To Do | 