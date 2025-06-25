# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Development Commands

**Core Commands:**

- `yarn start` - Start Metro development server (includes validation)
- `yarn validate` - Run all checks: type-check, format, and lint
- `yarn type-check` - TypeScript compilation check
- `yarn lint` - Run ESLint checks
- `yarn lint:fix` - Auto-fix ESLint issues
- `yarn format` - Format code with Prettier
- `yarn format:check` - Check Prettier formatting

**Platform-specific:**

- `yarn ios` - Run on iOS simulator (includes validation)
- `yarn android` - Run on Android emulator (includes validation)

**Backend Services:**

- `supabase start` - Start local Supabase stack (Docker required)
- `supabase stop` - Stop local Supabase services

## Project Architecture

### Technology Stack

- **Frontend**: React Native with Expo, TypeScript
- **Backend**: Supabase (PostgreSQL, Auth, Realtime, Storage)
- **State Management**: Zustand for chat state
- **Navigation**: React Navigation v6 (Stack + Tab navigators)
- **Styling**: StyleSheet.create with shared theme system

### Core Architecture Patterns

**Navigation Structure:**

- `RootNavigation` - Conditional rendering based on auth state
- `AuthStack` - Unauthenticated screens (Login, SignUp, PhoneAuth)
- `UserStack` - Main tab navigator (Chat, Camera, Friends, Profile)
- `ChatStack` - Chat-specific screens nested in UserStack

**Service Layer:**

- `services/supabase.ts` - Supabase client configuration
- `services/auth.ts` - Authentication operations
- `services/chat.ts` - Real-time messaging with Supabase Realtime
- `services/friends.ts` - Friend management and social features
- `services/user.ts` - User profile operations

**State Management:**

- Zustand stores in `src/stores/` for complex state (chat messages, unread
  counts)
- Custom hooks in `src/utils/hooks/` for shared logic
- `useAuthentication` hook manages auth state across app

**Component Organization:**

- `components/` - Reusable UI components with co-located styles
- `screens/` - Screen-level components with individual `index.tsx` and
  `styles.ts`
- Barrel exports (`index.ts`) for clean imports

### Database & Backend Logic

**Security Model:**

- Row Level Security (RLS) enabled on all tables
- JWT-based access control using `auth.uid()`
- Friend-based visibility for private content

**Content Lifecycle:**

- Ephemeral content (24-hour expiration) via RLS policies
- Automated cleanup via scheduled Edge Functions
- Real-time updates using Supabase Realtime

**User Score System:**

- Automatically updated via PostgreSQL triggers
- +10 points for stories, +5 for messages
- Atomic updates using database functions

## Development Guidelines

**TypeScript:**

- Strict mode enabled with path aliases (`@/*` for `src/*`)
- Type definitions in `src/types/` organized by domain
- Interface naming with descriptive prefixes

**Code Quality:**

- ESLint with Airbnb config + TypeScript rules
- Prettier for consistent formatting
- Pre-validation on all platform commands

**Component Patterns:**

- Functional components with hooks
- Co-located styles using `StyleSheet.create`
- Memoization for performance-critical components
- Accessibility labels for interactive elements

**Environment Setup:**

- Local Supabase required for development
- Environment variables in `.env` (copy from `env.example`)
- Docker Desktop must be running for Supabase stack

## Key Files & Directories

**Configuration:**

- `package.json` - Contains all development scripts
- `tsconfig.json` - TypeScript configuration with path mapping
- `supabase/migrations/` - Database schema and functions
- `.cursor/rules/` - Development guidelines and coding standards

**Feature Documentation:**

- `feature_docs/` - Detailed implementation plans
- `PRODUCT_REQUIREMENTS_DOCUMENT.md` - Product vision and requirements
- `README.md` - Complete setup and architecture guide
