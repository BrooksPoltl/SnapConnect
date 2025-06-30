# SnapConnect Financial Messenger

SnapConnect is a mobile-first social messaging application designed for the
financial community. It combines the engaging, ephemeral nature of platforms
like Snapchat with powerful, finance-specific tools and **AI-powered insights**,
allowing users to share timely insights through disappearing photo and video
messages.

The application allows users—from professional analysts to retail investors and
students—to share timely insights and **interact with AI for financial
analysis**, fostering a more informed and connected financial community.

## Table of Contents

- [1. Product Vision](#1-product-vision)
  - [1.1. The Problem](#11-the-problem)
  - [1.2. Our Solution](#12-our-solution)
  - [1.3. Target Audience](#13-target-audience)
- [2. Key Features](#2-key-features)
- [3. Development Roadmap](#3-development-roadmap)
- [4. Design & Planning Documents](#4-design--planning-documents)
- [5. Technical Architecture](#5-technical-architecture)
  - [5.1. Technology Stack](#51-technology-stack)
  - [5.2. Project Structure](#52-project-structure)
  - [5.3. Core Backend Logic](#53-core-backend-logic)
- [6. Getting Started](#6-getting-started)
  - [6.1. Prerequisites](#61-prerequisites)
  - [6.2. Local Development Setup](#62-local-development-setup)
  - [6.3. Development Scripts](#63-development-scripts)
  - [6.4. Network Troubleshooting](#64-network-troubleshooting)
  - [6.5. Code Quality Standards](#65-code-quality-standards)

## 1. Product Vision

### 1.1. The Problem

Financial news and analysis are scattered across platforms that are either too
noisy (like Twitter) or too formal (like professional terminals). There is a
need for a dedicated space where timely, digestible financial insights can be
shared quickly among a trusted network.

### 1.2. Our Solution

SnapConnect provides a mobile-first platform for ephemeral, media-rich financial
content with **integrated AI-powered insights**. By creating a sense of urgency
with disappearing messages and stories, it encourages daily engagement. A
gamified user score motivates content creation, and **implemented AI tools**
help creators generate accurate, data-driven content more efficiently through
RAG (Retrieval-Augmented Generation) technology powered by SEC filings and
OpenAI.

### 1.3. Target Audience

- **Johnny (The Creator)**: A savvy retail investor who wants to share his
  market analysis and build a trusted community with tools that help him create
  unique, data-rich content.
- **Timmy (The Consumer)**: A finance student who wants to access exclusive,
  timely insights from trusted creators in an engaging and modern format.

## 2. Key Features

### 🤖 AI-Powered Financial Insights ✅ **FULLY IMPLEMENTED**

- **RAG Chat Interface**: Interactive AI assistant powered by SEC filing data
  and OpenAI GPT-4o-mini
- **Conversation Management**: Create, edit, and manage titled conversation
  threads with the AI
- **Financial Context**: AI responses grounded in real EDGAR filing data with
  source citations
- **Share AI Insights**: Post AI responses to public/friend feeds via dedicated
  share modal
- **Collapsible Responses**: Long AI responses with expand/collapse
  functionality for better UX
- **Source Citations**: Clickable source references with detailed financial
  document links

### 💬 Social Messaging ✅ **FULLY IMPLEMENTED**

- **Ephemeral Stories**: Photo and video stories with 24-hour auto-deletion
- **Real-Time Chat**: One-on-one and group text conversations with Supabase
  Realtime
- **Group Messaging**: Create and manage group chats with multiple participants
- **Media Messaging**: Send photos and videos with drawing/annotation tools
- **Message Status**: Read receipts and typing indicators
- **Story Management**: Create, view, and delete your own stories with detailed
  viewer analytics

### 🎮 Social Features ✅ **FULLY IMPLEMENTED**

- **Friend System**: Complete social graph with friend requests, search by
  username, and blocking
- **User Profiles**: Detailed profiles with user scores, friend counts, and
  story history
- **Gamified Scoring**: Automated point system (+10 stories, +5 messages) with
  database triggers
- **Group Management**: Create groups, add/remove members, and manage group
  settings
- **Phone Authentication**: Secure authentication with phone number verification
- **Onboarding Flow**: Comprehensive user onboarding with feature demonstrations

### 📱 Media & Camera Features ✅ **FULLY IMPLEMENTED**

- **Advanced Camera**: Custom camera interface with photo/video capture
- **Media Storage**: Secure cloud storage with automatic cleanup
- **AR Text Overlay**: Add custom text overlays to media content
- **Story Viewer**: Instagram-style story viewing with tap navigation

## 3. Development Roadmap

The project is broken into two main phases:

### Phase 1: Core Social Messenger ✅ **COMPLETED**

- **Focus**: Build the foundational social features.
- **Includes**: User Authentication, Profiles, Friend Management, Real-Time
  Chat, Ephemeral Stories, and the User Score system.

### Phase 2: RAG-Enhanced Content Creation ✅ **COMPLETED**

- **Focus**: Introduce AI-powered tools to enrich content.
- **Includes**: A Retrieval-Augmented Generation (RAG) model using official
  corporate filings (from EDGAR) and OpenAI to help users generate accurate,
  data-driven insights and responses.
- **Implementation**: Full chat interface, conversation management, AI feed
  system, and Node.js API with Pinecone vector search integration.

## 4. Design & Planning Documents

This project includes detailed documentation covering product requirements,
technical architecture, and feature implementation plans. These documents
provide essential context for understanding the project's goals and technical
foundation.

All planning documents are located in the [`/feature_docs`](./feature_docs/)
directory.

- **[Product Requirements Document (PRD)](./PRODUCT_REQUIREMENTS_DOCUMENT.md)**:
  Outlines the product's vision, user personas, functional requirements, and
  success metrics.
- **[Technical Architecture](./feature_docs/TECHNICAL_ARCHITECTURE_P1.md)**:
  Describes the Supabase-based backend, including the database schema, security
  model, and core logic.
- **[AI RAG Chat Feature](./feature_docs/ai-rag-chat.md)**: ✅ **COMPLETED**
  Comprehensive implementation plan and status for the AI-powered chat feature
  with RAG integration.

## 5. Technical Architecture

The application is built with a modern, scalable stack designed for real-time
mobile experiences.

### 5.1. Technology Stack

#### Frontend

- **React Native**: v0.79.4 with Expo SDK 53.0.13
- **TypeScript**: Full type safety with strict configuration
- **Navigation**: React Navigation v7 with stack navigation
- **State Management**: Zustand for global state (chat, groups)
- **UI/Animations**: React Native Reanimated, React Native Skia, Linear Gradient
- **Camera/Media**: Expo Camera, Image Picker, AV, Media Library
- **Real-time**: Supabase Realtime for live messaging

#### Backend & Services

- **Database**: Supabase PostgreSQL with Row Level Security (RLS)
- **Authentication**: Supabase Auth with phone number verification
- **Storage**: Supabase Storage for media files with automatic cleanup
- **Real-time**: Supabase Realtime subscriptions for live messaging
- **Edge Functions**: Supabase Edge Functions for server-side processing

#### AI Infrastructure

- **RAG System**: Node.js TypeScript API with OpenAI GPT-4o-mini
- **Vector Database**: Pinecone for document embeddings and similarity search
- **Data Sources**: SEC EDGAR filings for financial context and insights
- **Processing**: Document ingestion and chunking for optimal RAG performance

#### Development Tools

- **Linting**: ESLint with Airbnb TypeScript configuration
- **Formatting**: Prettier for consistent code style
- **Quality**: Pre-commit hooks with `yarn prebuild` validation
- **Navigation**: File-based routing with typed navigation parameters

### 5.2. Project Structure

The project follows a modular, AI-first codebase structure with the core
application logic located in the `src/` directory. All files are designed to be
under 500 lines for maximum AI tool compatibility.

#### Frontend Structure (`src/`)

- **`src/components/`**: 35+ reusable UI components organized by feature:
  - **AI Components**: `AIConversationSkeleton`, `CollapsibleText`,
    `SourceList`, `SourceCitation`
  - **Animation Components**: `AnimatedCard`, `AnimatedPressable`,
    `AnimatedText`, `FadeInAnimation`, `PulseAnimation`
  - **Camera Components**: `Camera`, `CameraActions`, `CameraControls`,
    `CameraOptions`, `CameraPermissionStatus`
  - **Drawing Components**: `DrawingCanvas`, `DrawingToolbar`
  - **Social Components**: `Avatar`, `FriendListItem`, `ConversationCard`,
    `ConversationListItem`
  - **UI Components**: `FormField`, `Icon`, `ScreenHeader`, `PhotoPreview`,
    `ReturnButton`
  - **Skeleton Loaders**: `CardSkeleton`, `ConversationListSkeleton`,
    `SkeletonLoader`, `StoryListSkeleton`
  - **Onboarding**: `OnboardingSlide`, `OnboardingSnapshots`

- **`src/screens/`**: 20+ screen components for all app functionality:
  - **Authentication**: `LogInScreen`, `SignUpScreen`, `PhoneAuthScreen`,
    `OnboardingScreen`
  - **AI Features**: `AIChatScreen`, `AIHomeScreen`, `CreateAIPostScreen`
  - **Social Features**: `HomeScreen`, `FeedScreen`, `ProfileScreen`
  - **Messaging**: `ChatScreen`, `ConversationScreen`
  - **Group Features**: `CreateGroupScreen`, `GroupConversationScreen`,
    `GroupDetailsScreen`, `AddGroupMembersScreen`
  - **Friends**: `FriendsListScreen`, `AddFriendScreen`
  - **Stories**: `StoriesScreen`, `StoryViewerScreen`, `MyStoryViewerScreen`
  - **Media**: `CameraScreen`, `MediaPreviewScreen`, `MediaViewerScreen`,
    `SelectRecipientsScreen`

- **`src/services/`**: Comprehensive service layer with 9 specialized modules:
  - `ai.ts`: AI/RAG functionality and conversation management (276 lines)
  - `groups.ts`: Group chat creation and management (383 lines)
  - `user.ts`: User profiles and management (307 lines)
  - `friends.ts`: Friend system and social graph (286 lines)
  - `chat.ts`: Real-time messaging (216 lines)
  - `auth.ts`: Authentication and session management (157 lines)
  - `stories.ts`: Ephemeral content management (140 lines)
  - `media.ts`: File upload and media handling (132 lines)
  - `supabase.ts`: Supabase client configuration (72 lines)

- **`src/navigation/`**: Navigation architecture with 5 specialized stacks:
  - `RootNavigation.tsx`: Main navigation coordinator
  - `UserStack.tsx`: Authenticated user flow navigation (340 lines)
  - `AuthStack.tsx`: Authentication flow
  - `ChatStack.tsx`: Messaging navigation
  - `FriendsStack.tsx`: Social features navigation

- **`src/stores/`**: Zustand state management:
  - `chatStore.ts`: Chat state and real-time messaging (171 lines)
  - `groupStore.ts`: Group chat state management (399 lines)

- **`src/types/`**: Comprehensive TypeScript definitions:
  - `ai.ts`: AI/RAG related types
  - `chat.ts`: Messaging types
  - `groups.ts`: Group functionality types
  - `user.ts`, `auth.ts`, `stories.ts`, `media.ts`: Feature-specific types
  - `navigation.ts`: Navigation parameter types
  - `theme.ts`: Styling types

- **`src/styles/`**: Centralized styling system:
  - `theme.ts`: Theme configuration and dark/light mode
  - `shared/`: Reusable style components (buttons, containers, text)

- **`src/utils/`**: Utility functions and custom hooks:
  - `logger.ts`: Centralized logging for debugging
  - `hooks/`: Custom React hooks including `useAuthentication.ts`

#### Backend Structure

- **`api/`**: Node.js TypeScript API endpoints for AI/RAG functionality
- **`supabase/migrations/`**: 30+ database migrations with comprehensive schema
- **`supabase/functions/`**: Edge functions for AI processing and data
  operations
- **`scripts/`**: Data processing and automation scripts
  - `edgar_ingestion/`: Python scripts for SEC EDGAR filing data ingestion and
    processing for RAG system

### 5.3. Core Backend Logic

The backend is built around a secure and efficient data model.

- **Security Model (Row Level Security)**: The system is secure by default. RLS
  is enabled on all tables, and access is granted only through explicit policies
  that check a user's JWT (`auth.uid()`). For example, a user can only see a
  "private" story if they are an accepted friend of the author.
- **Content Expiration (Hybrid TTL)**: A two-part system ensures content
  disappears reliably.
  1.  **Instant Invisibility**: RLS policies instantly hide content older than
      24 hours from all user queries.
  2.  **Permanent Deletion**: A scheduled Supabase Edge Function
      (`daily-cleanup`) runs once per day to permanently delete the expired data
      and associated media files from Storage.
- **Automated User Score**: The user score is updated automatically and
  efficiently using Postgres triggers. An `on insert` trigger on the `messages`
  and `stories` tables calls a database function (`update_user_score`) to
  increment the creator's score atomically.

## 6. Getting Started

This guide covers how to set up and run the SnapConnect project on your local
machine for development and testing.

### 6.1. Prerequisites

Make sure you have the following software installed on your system:

- **Node.js**: LTS version (e.g., v18 or later)
- **Yarn**: For package management (`npm install -g yarn`)
- **Docker Desktop**: Must be running to host the local Supabase stack.
- **Supabase CLI**: For managing the local development environment
  (`brew install supabase/tap/supabase-cli` for macOS/Linux).
- **Expo Go**: The app on your mobile device (iOS or Android) or a configured
  local simulator.

### 6.2. Local Development Setup

Follow these steps to get the application and its backend services running
locally.

1.  **Clone the repository:**

    ```sh
    git clone <repository-url>
    cd SnapConnect
    ```

2.  **Install Frontend Dependencies:**

    ```sh
    yarn install
    ```

3.  **Start Local Backend Services:** This command starts the entire Supabase
    stack (database, auth, etc.) in Docker.

    ```sh
    supabase start
    ```

    The first time you run this, it will download the necessary Docker images
    and apply all database migrations located in `supabase/migrations`. On
    successful startup, the CLI will output your local Supabase `API URL` and
    `anon key`.

4.  **Configure Environment Variables:** The application connects to Supabase
    using environment variables.
    - Create a `.env` file in the project root by copying the example file:
      ```sh
      cp env.example .env
      ```
    - Open the new `.env` file and fill in the local `API URL` and `anon key`
      provided by the `supabase start` command. It should look like this:
      ```env
      EXPO_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
      EXPO_PUBLIC_SUPABASE_ANON_KEY=your-local-anon-key-from-the-cli
      ```

5.  **Verify Your Setup:** Before running the application, validate your code:

    ```sh
    yarn prebuild
    ```

    This command runs type checking, formatting, and linting to ensure your code
    is ready for development.

6.  **Run the Application:** Start the Metro development server:

    ```sh
    yarn start
    ```

    **Network Troubleshooting:** If you encounter network connectivity issues:

    ```sh
    # Use tunnel connection for network issues (slower but more reliable)
    yarn start --tunnel

    # Clear Metro cache if experiencing build issues
    yarn start --clear

    # Combine both options if needed
    yarn start --tunnel --clear
    ```

7.  **Launch the App:**
    - Scan the QR code generated by Metro with the Expo Go app on your phone.
    - Or, press `i` to launch the iOS Simulator or `a` to launch the Android
      Emulator.

The app will now be running and connected to your local Supabase instance. Any
changes you make to the frontend code will reload automatically. If you make
changes to the backend (e.g., create a new database migration), you may need to
restart the Supabase services (`supabase stop` and `supabase start`).

### 6.3. Development Scripts

The project includes several helpful development scripts:

- **`yarn prebuild`**: Validates code quality (type checking, formatting,
  linting) - **always run this after making changes**
- **`yarn validate`**: Same as prebuild - ensures code quality before committing
- **`yarn lint`**: Run ESLint to check for code issues
- **`yarn lint:fix`**: Automatically fix linting issues where possible
- **`yarn format`**: Format code with Prettier
- **`yarn type-check`**: Run TypeScript compiler to check for type errors
- **`yarn start`**: Start development server with validation
- **`yarn ios`**: Run on iOS simulator with validation
- **`yarn android`**: Run on Android emulator with validation

### 6.4. Network Troubleshooting

If you encounter connectivity issues during development, Expo provides several
flags to resolve common problems:

#### `--tunnel` Flag

- **Purpose**: Routes connections through Expo's servers instead of direct local
  network
- **When to use**:
  - Corporate firewalls blocking local connections
  - Complex network configurations (VPNs, restricted WiFi)
  - Unable to connect physical device to development server
- **Trade-off**: Slower than local connections but more reliable
- **Usage**: `yarn start --tunnel`

#### `--clear` Flag

- **Purpose**: Clears Metro bundler cache and temporary files
- **When to use**:
  - Experiencing unexplained build errors
  - Code changes not reflecting in app
  - After installing new dependencies
  - Strange bundling or transformation issues
- **Usage**: `yarn start --clear`

#### Common Network Issues

- **Corporate/University Networks**: Often require `--tunnel` due to firewall
  restrictions
- **Multiple Network Interfaces**: May need `--tunnel` if your machine has
  multiple network adapters
- **Cache Corruption**: Use `--clear` if seeing outdated code or bundle errors
- **Expo Go Connection**: If QR code scanning fails, try `--tunnel` for more
  reliable connection

For more information, see
[Expo CLI documentation](https://docs.expo.dev/more/expo-cli/) and
[Expo troubleshooting guide](https://docs.expo.dev/troubleshooting/).

### 6.5. Code Quality Standards

The codebase follows strict quality standards:

- **TypeScript**: Full type safety with strict configuration
- **ESLint**: Airbnb configuration with React Native specific rules
- **Prettier**: Consistent code formatting
- **File Size Limit**: All files kept under 500 lines for AI tool compatibility
- **Modular Architecture**: Clean separation of concerns with single
  responsibility principle
- **Centralized Logging**: Use `@utils/logger.ts` for all logging operations
