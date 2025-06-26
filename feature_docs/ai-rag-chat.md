# AI RAG Chat & Feed Feature Plan

✅ **COMPLETED** - This feature introduces an AI-powered chat interface, user-titled conversation
history, and public/friend-only feeds for sharing insights.

## Implementation Summary

The RAG (Retrieval-Augmented Generation) chat feature has been fully implemented with:
- Complete backend infrastructure (3 tables, 8 RPC functions)
- Node.js TypeScript API endpoint with Pinecone vector search and OpenAI integration
- Full frontend implementation with 3 new screens
- Seamless integration with existing navigation and chat systems

### Backend - AI Posts & Feeds

| Priority | Task Description             | Implementation Details                                                                                                                                              | Code Pointers          | Dependencies                    | Status      |
| :------- | :--------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :--------------------- | :------------------------------ | :---------- |
| **High** | Create `ai_posts` table      | ✅ Created table to store public posts. Columns: `id`, `user_id`, `user_commentary`, `ai_response`, `source_link`, `created_at`, and `privacy` ('public' or 'friends'). | `supabase/migrations/20250101000000_create_ai_tables.sql` | None                            | **DONE** |
| **High** | Create `get_public_feed` RPC | ✅ Fetches posts where `privacy = 'public'`. Paginated. Joins with `profiles`.                                                                                         | `supabase/migrations/20250101000001_create_ai_functions.sql` | `ai_posts` table                | **DONE** |
| **High** | Create `get_friend_feed` RPC | ✅ Fetches posts where `privacy = 'friends'` AND the author is in the current user's friend list. Paginated.                                                           | `supabase/migrations/20250101000001_create_ai_functions.sql` | `ai_posts` table, Friends logic | **DONE** |
| **High** | Create `create_ai_post` RPC  | ✅ Allows an authenticated user to insert a record into `ai_posts`, accepting a `privacy` parameter.                                                                   | `supabase/migrations/20250101000001_create_ai_functions.sql` | `ai_posts` table                | **DONE** |

### Backend - AI Conversation History

| Priority   | Task Description                          | Implementation Details                                                                                                       | Code Pointers          | Dependencies             | Status      |
| :--------- | :---------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------- | :--------------------- | :----------------------- | :---------- |
| **High**   | Create `ai_conversations` table           | ✅ Stores chat session metadata. Columns: `id`, `user_id`, `title` (TEXT, `default 'untitled conversation'`), `created_at`.     | `supabase/migrations/20250101000000_create_ai_tables.sql` | None                     | **DONE** |
| **High**   | Create `ai_messages` table                | ✅ Stores each message in a conversation. Columns: `id`, `conversation_id`, `sender` ('user' or 'ai'), `content`, `created_at`. | `supabase/migrations/20250101000000_create_ai_tables.sql` | `ai_conversations` table | **DONE** |
| **High**   | RLS Policies for new tables               | ✅ Secure `ai_conversations` and `ai_messages` so a user can only access their own data.                                        | `supabase/migrations/20250101000000_create_ai_tables.sql` | New tables               | **DONE** |
| **High**   | Create `get_user_ai_conversations` RPC    | ✅ Fetches all of the current user's conversation threads from `ai_conversations` with message counts and last activity.              | `supabase/migrations/20250101000001_create_ai_functions.sql` | `ai_conversations` table | **DONE** |
| **High**   | Create `get_ai_conversation_messages` RPC | ✅ Fetches all messages for a given `conversation_id`, ordered by `created_at`.                                                 | `supabase/migrations/20250101000001_create_ai_functions.sql` | `ai_messages` table      | **DONE** |
| **Medium** | Create `update_ai_conversation_title` RPC | ✅ Creates a function to allow a user to update the title of their own conversation.                                            | `supabase/migrations/20250101000001_create_ai_functions.sql` | `ai_conversations` table | **DONE** |
| **High**   | Create `create_ai_conversation` RPC       | ✅ Creates new AI conversations with default title.                                                                             | `supabase/migrations/20250101000001_create_ai_functions.sql` | `ai_conversations` table | **DONE** |
| **High**   | Create `add_ai_message` RPC               | ✅ Adds messages to conversations with proper validation.                                                                       | `supabase/migrations/20250101000001_create_ai_functions.sql` | `ai_messages` table      | **DONE** |

### Backend - RAG API Integration

| Priority | Task Description                | Implementation Details                                                                                                    | Code Pointers           | Dependencies                  | Status      |
| :------- | :------------------------------ | :------------------------------------------------------------------------------------------------------------------------ | :---------------------- | :---------------------------- | :---------- |
| **High** | Create RAG API Endpoint         | ✅ Node.js TypeScript API with Pinecone vector search and OpenAI chat completion integration.                           | `api/query-rag-model.ts` | OpenAI, Pinecone APIs         | **DONE** |
| **High** | Implement Vector Search         | ✅ Query Pinecone for relevant EDGAR filing context based on user prompts.                                              | `api/query-rag-model.ts` | Pinecone vector database      | **DONE** |
| **High** | Implement AI Response Generation| ✅ Use OpenAI GPT-4o-mini with retrieved context to generate financial insights.                                        | `api/query-rag-model.ts` | OpenAI API                    | **DONE** |
| **High** | Conversation Persistence        | ✅ Automatically save user queries and AI responses to database conversations.                                           | `api/query-rag-model.ts` | Database RPC functions        | **DONE** |

### Frontend

| Priority   | Task Description                         | Implementation Details                                                                                                                                                 | Code Pointers                                             | Dependencies                         | Status      |
| :--------- | :--------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------- | :----------------------------------- | :---------- |
| **High**   | Create AI Service & Types                | ✅ Created `src/services/ai.ts` for all AI-related functions and `src/types/ai.ts` for data models.                                                                        | `src/services/ai.ts`, `src/types/ai.ts`                   | Backend RPCs                         | **DONE** |
| **High**   | Rename `MapScreen` -> `AIHomeScreen`     | ✅ Screen lists past conversations with metadata (message count, last activity).                                                                                              | `src/screens/AIHomeScreen/`     | None                                 | **DONE** |
| **High**   | Rename `SpotlightScreen` -> `FeedScreen` | ✅ Screen houses the public and friend feeds with tab switching.                                                                                                                    | `src/screens/FeedScreen/` | None                                 | **DONE** |
| **High**   | Update Root Navigation                   | ✅ Replaced `MapScreen` and `SpotlightScreen` with `AIHomeScreen` and `FeedScreen` in UserStack.                                                                                        | `src/navigation/UserStack.tsx`                       | Screen renaming                      | **DONE** |
| **High**   | Build `AIHomeScreen` UI                  | ✅ Displays list of AI conversations with "New Chat" button. Shows conversation metadata and navigation.                                                                                   | `src/screens/AIHomeScreen/index.tsx`                      | `get_user_ai_conversations`          | **DONE** |
| **High**   | Create `AIChatScreen`                    | ✅ Full chat UI for conversations with editable title field, message history, and share functionality.                                                                    | `src/screens/AIChatScreen/index.tsx`                      | `AIHomeScreen`                       | **DONE** |
| **High**   | Build `FeedScreen` UI                    | ✅ Added tabs for "Public" and "Friends" feeds, displaying posts from the respective service calls.                                                                         | `src/screens/FeedScreen/index.tsx`                        | `get_public_feed`, `get_friend_feed` | **DONE** |
| **Medium** | Implement Conversation Title Editing     | ✅ In `AIChatScreen`, users can tap header to edit title. Calls `update_ai_conversation_title` service. Defaults to 'untitled conversation' on new chats. | `src/screens/AIChatScreen/index.tsx`                      | `AIChatScreen` UI                    | **DONE** |
| **Medium** | Implement "Share" Flow                   | ✅ AI message "Share" button opens modal with options: "Post to Feed" or "Send to a Friend".                                                                         | `src/screens/AIChatScreen/index.tsx`                      | `AIChatScreen` UI                    | **DONE** |
| **Medium** | Create `CreateAIPostScreen`              | ⏳ To be navigated to from "Post to Feed". Will include privacy toggle, commentary input, and quoted AI response.                                                                 | `src/screens/CreateAIPostScreen/index.tsx`                | "Share" Flow                         | **TODO** |
| **Medium** | Update "Send to Friend" Flow             | ✅ "Send to a Friend" shows coming soon alert (temporary implementation).                                                                                 | `src/screens/AIChatScreen/index.tsx`                      | "Share" Flow                         | **PARTIAL** |

## Key Features Implemented

### 🤖 AI Chat Interface
- **Real-time conversations** with AI assistant
- **Persistent conversation history** with database storage
- **Editable conversation titles** (tap to edit, defaults to "untitled conversation")
- **Message bubbles** with distinct styling for user vs AI messages
- **Share functionality** for AI responses

### 📱 Navigation Integration
- **AIHomeScreen** replaces MapScreen - shows conversation list with metadata
- **FeedScreen** replaces SpotlightScreen - displays public/friends AI posts
- **AIChatScreen** - full chat interface with title editing and sharing
- **Seamless navigation** between screens with proper parameter passing

### 🔧 Technical Implementation
- **TypeScript throughout** with proper type safety
- **Node.js API endpoint** for RAG functionality
- **Pinecone vector search** for relevant context retrieval
- **OpenAI GPT-4o-mini** for response generation
- **Comprehensive error handling** and user feedback
- **Logging integration** for debugging and monitoring

### 🗄️ Database Schema
- **3 new tables**: `ai_conversations`, `ai_messages`, `ai_posts`
- **8 RPC functions** for conversation and feed management
- **Row Level Security** policies for data protection
- **Optimized queries** with proper indexing and joins

## Next Steps

1. **Environment Setup**: Configure OpenAI and Pinecone API keys
2. **Database Migration**: Run migration files to set up the database
3. **EDGAR Data Ingestion**: Populate Pinecone with SEC filing data
4. **CreateAIPostScreen**: Complete the post creation interface
5. **Testing**: End-to-end testing of the full RAG pipeline

## Files Modified/Created

### New Files
- `api/query-rag-model.ts` - Node.js TypeScript RAG API endpoint
- `src/types/ai.ts` - AI-related TypeScript interfaces
- `src/services/ai.ts` - AI service functions
- `src/screens/AIHomeScreen/` - Conversation list screen
- `src/screens/AIChatScreen/` - Chat interface screen
- `src/screens/FeedScreen/` - AI posts feed screen
- `supabase/migrations/20250101000000_create_ai_tables.sql` - Database schema
- `supabase/migrations/20250101000001_create_ai_functions.sql` - RPC functions

### Modified Files
- `src/navigation/UserStack.tsx` - Updated navigation structure
- `src/types/navigation.ts` - Added new screen parameters
- `src/services/index.ts` - Exported AI service
- `src/types/index.ts` - Exported AI types
- `tsconfig.json` - Excluded API directory
- `eslint.config.js` - Ignored API and scripts directories
