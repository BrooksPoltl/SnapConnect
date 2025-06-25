# SnapConnect Financial Messenger

SnapConnect is a mobile-first social messaging application designed for the financial community. It combines the engaging, ephemeral nature of platforms like Snapchat with powerful, finance-specific tools, allowing users to share timely insights through disappearing photo and video messages.

The application allows users—from professional analysts to retail investors and students—to share timely insights, fostering a more informed and connected financial community.

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
  - [6.2. Installation](#62-installation)

## 1. Product Vision

### 1.1. The Problem
Financial news and analysis are scattered across platforms that are either too noisy (like Twitter) or too formal (like professional terminals). There is a need for a dedicated space where timely, digestible financial insights can be shared quickly among a trusted network.

### 1.2. Our Solution
SnapConnect provides a mobile-first platform for ephemeral, media-rich financial content. By creating a sense of urgency with disappearing messages and stories, it encourages daily engagement. A gamified user score motivates content creation, and planned AI tools will help creators generate accurate, data-driven content more efficiently.

### 1.3. Target Audience
- **Johnny (The Creator)**: A savvy retail investor who wants to share his market analysis and build a trusted community with tools that help him create unique, data-rich content.
- **Timmy (The Consumer)**: A finance student who wants to access exclusive, timely insights from trusted creators in an engaging and modern format.

## 2. Key Features

- **Ephemeral Messaging & Stories**: Send photo and video messages, or post stories to a public or private audience. All content is automatically deleted after 24 hours, creating a sense of urgency.
- **Real-Time Chat**: Engage in one-on-one text conversations with real-time message delivery, powered by Supabase Realtime.
- **Gamified User Score**: A simple and visible metric for engagement. Users gain points for creating content (+10 for a story, +5 for a message) to build their profile score and reputation.
- **Friend Management**: A full-featured social graph, allowing users to search by username, send/manage friend requests, and block users.
- **Simple AR Filters**: An MVP feature allowing users to overlay custom text (e.g., "$AAPL +5%") on their photo or video content.

## 3. Development Roadmap

The project is broken into two main phases:

### Phase 1: Core Social Messenger (Current)
- **Focus**: Build the foundational social features.
- **Includes**: User Authentication, Profiles, Friend Management, Real-Time Chat, Ephemeral Stories, and the User Score system.

### Phase 2: RAG-Enhanced Content Creation
- **Focus**: Introduce AI-powered tools to enrich content.
- **Includes**: A Retrieval-Augmented Generation (RAG) model using official corporate filings (from EDGAR) and OpenAI to help users generate accurate, data-driven captions for their posts.

## 4. Design & Planning Documents

This project includes detailed documentation covering product requirements, technical architecture, and feature implementation plans. These documents provide essential context for understanding the project's goals and technical foundation.

All planning documents are located in the [`/feature_docs`](./feature_docs/) directory.

- **[Product Requirements Document (PRD)](./PRODUCT_REQUIREMENTS_DOCUMENT.md)**: Outlines the product's vision, user personas, functional requirements, and success metrics.
- **[Technical Architecture](./feature_docs/TECHNICAL_ARCHITECTURE_P1.md)**: Describes the Supabase-based backend, including the database schema, security model, and core logic.

## 5. Technical Architecture

The application is built with a modern, scalable stack designed for real-time mobile experiences.

### 5.1. Technology Stack
- **Frontend**: React Native (with Expo) and TypeScript.
- **Backend**: A full Supabase stack, including Auth, a Postgres Database, Storage, Realtime, and Deno-based Edge Functions.

### 5.2. Project Structure
The project follows a standard Expo project structure, with the core application logic located in the `src/` directory.

- `src/components`: Reusable UI components.
- `src/navigation`: Navigation logic, including stacks and routes.
- `src/screens`: Top-level screen components.
- `src/services`: Supabase client and interaction logic.
- `src/styles`: Theme, shared styles, and styling utilities.
- `src/types`: TypeScript type definitions.
- `src/utils`: Shared utilities and hooks.

### 5.3. Core Backend Logic
The backend is built around a secure and efficient data model.

- **Security Model (Row Level Security)**: The system is secure by default. RLS is enabled on all tables, and access is granted only through explicit policies that check a user's JWT (`auth.uid()`). For example, a user can only see a "private" story if they are an accepted friend of the author.
- **Content Expiration (Hybrid TTL)**: A two-part system ensures content disappears reliably.
    1.  **Instant Invisibility**: RLS policies instantly hide content older than 24 hours from all user queries.
    2.  **Permanent Deletion**: A scheduled Supabase Edge Function (`daily-cleanup`) runs once per day to permanently delete the expired data and associated media files from Storage.
- **Automated User Score**: The user score is updated automatically and efficiently using Postgres triggers. An `on insert` trigger on the `messages` and `stories` tables calls a database function (`update_user_score`) to increment the creator's score atomically.

## 6. Getting Started

### 6.1. Prerequisites
- Node.js (LTS version)
- Yarn
- Expo Go app on your mobile device or a configured Android/iOS simulator.
- A Supabase project set up with the required database schema and RLS policies.

### 6.2. Installation
1.  **Clone the repository:**
    ```sh
    git clone <repository-url>
    cd SnapConnect
    ```
2.  **Install dependencies:**
    ```sh
    yarn install
    ```
3.  **Configure Supabase environment variables:**
    Create a `.env` file in the root directory and add your Supabase project URL and anon key:
    ```
    EXPO_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
    EXPO_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    ```
4.  **Start the development server:**
    ```sh
    yarn start
    ```
5.  **Run the app:**
    Scan the QR code with the Expo Go app on your device, or press `i` for the iOS Simulator or `a` for the Android Emulator.
