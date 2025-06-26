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

### 🤖 AI-Powered Financial Insights

- **RAG Chat Interface**: Interactive AI assistant powered by SEC filing data
  and OpenAI
- **Conversation History**: Persistent, titled conversation threads with the AI
- **Financial Context**: AI responses grounded in real EDGAR filing data
- **Share AI Insights**: Post AI responses to public/friend feeds or send to
  friends

### 💬 Social Messaging

- **Ephemeral Messaging & Stories**: Send photo and video messages, or post
  stories to a public or private audience. All content is automatically deleted
  after 24 hours, creating a sense of urgency.
- **Real-Time Chat**: Engage in one-on-one text conversations with real-time
  message delivery, powered by Supabase Realtime.
- **AI Feed**: Browse public and friend-only AI insights and commentary

### 🎮 Engagement Features

- **Gamified User Score**: A simple and visible metric for engagement. Users
  gain points for creating content (+10 for a story, +5 for a message) to build
  their profile score and reputation.
- **Friend Management**: A full-featured social graph, allowing users to search
  by username, send/manage friend requests, and block users.
- **Simple AR Filters**: An MVP feature allowing users to overlay custom text
  (e.g., "$AAPL +5%") on their photo or video content.

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

- **Frontend**: React Native (with Expo) and TypeScript.
- **Backend**: A full Supabase stack, including Auth, a Postgres Database,
  Storage, Realtime, and Edge Functions.
- **AI Infrastructure**: Node.js TypeScript API with OpenAI GPT-4o-mini and
  Pinecone vector database for RAG functionality.
- **Data Sources**: SEC EDGAR filings for financial context and insights.

### 5.2. Project Structure

The project follows a standard Expo project structure, with the core application
logic located in the `src/` directory.

- `src/components`: Reusable UI components.
- `src/navigation`: Navigation logic, including stacks and routes.
- `src/screens`: Top-level screen components, including AI chat interfaces.
- `src/services`: Supabase client, AI service, and interaction logic.
- `src/styles`: Theme, shared styles, and styling utilities.
- `src/types`: TypeScript type definitions, including AI-related types.
- `src/utils`: Shared utilities and hooks.
- `api/`: Node.js TypeScript API endpoints for AI/RAG functionality.
- `supabase/migrations/`: Database schema and function definitions.

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

5.  **Run the Application:** Start the Metro development server.

    ```sh
    yarn start
    ```

6.  **Launch the App:**
    - Scan the QR code generated by Metro with the Expo Go app on your phone.
    - Or, press `i` to launch the iOS Simulator or `a` to launch the Android
      Emulator.

The app will now be running and connected to your local Supabase instance. Any
changes you make to the frontend code will reload automatically. If you make
changes to the backend (e.g., create a new database migration), you may need to
restart the Supabase services (`supabase stop` and `supabase start`).
