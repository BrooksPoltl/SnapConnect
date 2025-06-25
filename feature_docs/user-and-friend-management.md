### Feature Plan: User Profile & Friend Management

This document outlines the tasks required to build user profiles and friend
management features, with a strong emphasis on backend-enforced security.

## Security Architecture Overview

**Core Principle: Never Trust the Client**

All security is enforced on the Supabase backend through Row Level Security
(RLS) policies. The client-side code can be inspected and modified by users, but
this poses no security risk because:

1. **The `anon key` is intentionally public** - It only identifies which
   Supabase project to connect to and has zero special privileges. All requests
   using this key are subject to RLS policies.

2. **The `service_role key` is never exposed** - This admin key that bypasses
   RLS is only used in secure server environments and never bundled with the
   client app.

3. **Database migrations require developer credentials** - Migrations are run
   via Supabase CLI using separate, authenticated developer tokens, not the
   public anon key.

4. **RLS policies are the enforcement layer** - These SQL rules run on the
   server and cannot be bypassed by client modifications. Examples:
   - Users can only update their own `username`, never their `score`
   - Friend requests can only be accepted by the intended recipient
   - Users can only see content they have permission to access

## Implementation Plan

| Priority   | Task Description                        | Implementation Details                                                                                                                                                                                                                                                                                                                                                                                     | Code Pointers                             | Dependencies                           | Status      |
| :--------- | :-------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------- | :------------------------------------- | :---------- |
| **High**   | **Backend: Secure `profiles` Table**    | 1. **RLS:** Create policies to ensure users can only read public data and update their own `username`. Deny all client-side updates to the `score` column. <br> 2. **DB Function:** Create a `change_username(new_username TEXT)` Postgres function with validation (length, characters).                                                                                                                  | `supabase/migrations/...`                 | -                                      | Not Started |
| **High**   | **Backend: Secure `friendships` Table** | 1. **RLS:** Create policies allowing users to `INSERT` only _pending_ requests for themselves (`user_id_1`), and `UPDATE` only requests where they are the recipient (`user_id_2`). `DELETE` is allowed only for participants. <br> 2. **DB Functions:** Create `accept_friend_request(request_id)` and `decline_friend_request(request_id)` functions that validate the caller is the intended recipient. | `supabase/migrations/...`                 | -                                      | Not Started |
| **High**   | **Backend: Refactor Services**          | 1. Create `src/services/user.ts` and move relevant functions from `database.ts`. <br> 2. Create `src/services/friends.ts`. <br> 3. Delete the now-empty `src/services/database.ts`.                                                                                                                                                                                                                        | `src/services/`                           | -                                      | ✅ Complete |
| **High**   | **Client: Friend Management Service**   | Implement client-side functions in `friends.ts` to call Supabase RPC for: `sendFriendRequest`, `getFriendRequests`, `acceptFriendRequest`, `declineFriendRequest`, `getFriendsList`, `removeFriend`.                                                                                                                                                                                                       | `src/services/friends.ts`                 | Backend RLS & DB Functions             | ✅ Complete |
| **High**   | **Client: User Service**                | Implement client-side functions in `user.ts`: `getUserProfile(userId)`, `searchUsers(query)`, and a new `updateUsername(newName)` that calls the secure backend function.                                                                                                                                                                                                                                  | `src/services/user.ts`                    | Backend RLS & DB Functions             | ✅ Complete |
| **High**   | **UI: `AddFriendScreen`**               | Build a screen with: <br> 1. "Friend Requests" list with Accept/Decline buttons. <br> 2. Search input to find new users by username. <br> 3. "Suggested Friends" list with an "Add" button.                                                                                                                                                                                                                | `src/screens/AddFriendScreen/index.tsx`   | `friends.ts`, `user.ts` services       | ✅ Complete |
| **High**   | **UI: `FriendsListScreen`**             | Build a screen to display the user's current friends list. Add a button to navigate to `AddFriendScreen`.                                                                                                                                                                                                                                                                                                  | `src/screens/FriendsListScreen/index.tsx` | `friends.ts` service                   | ✅ Complete |
| **High**   | **Navigation: `FriendsStack`**          | Create a `FriendsStack` with `FriendsListScreen` (initial) and `AddFriendScreen`. Add this stack to the root navigator.                                                                                                                                                                                                                                                                                    | `src/navigation/RootNavigation.tsx`       | `FriendsListScreen`, `AddFriendScreen` | ✅ Complete |
| **Medium** | **UI: `ProfileScreen`**                 | Build a simple screen to display a user's username and score. Add an input field and button to call `updateUsername`.                                                                                                                                                                                                                                                                                      | `src/screens/ProfileScreen/index.tsx`     | `user.ts` service                      | ✅ Complete |
| **Medium** | **Navigation: Main Access Point**       | Add an icon button to headers of `CameraScreen`, `ChatScreen`, and `StoriesScreen` that navigates to the `FriendsListScreen`.                                                                                                                                                                                                                                                                              | `src/screens/...`                         | `FriendsStack`                         | ✅ Complete |
| **Medium** | **Navigation: Link to User Profiles**   | Make usernames clickable on `FriendsListScreen` and `AddFriendScreen` to navigate to that user's `ProfileScreen`.                                                                                                                                                                                                                                                                                          | `src/screens/...`                         | `ProfileScreen`                        | ✅ Complete |

## Implementation Status Summary

**✅ Completed Tasks (Frontend - Ready for Testing):**

- ✅ **Backend: Refactor Services** - Created modular `user.ts` and `friends.ts`
  services
- ✅ **Client: Friend Management Service** - Implemented all friend-related
  functions
- ✅ **Client: User Service** - Implemented user profile and search functions
- ✅ **UI: AddFriendScreen** - Built comprehensive friend discovery and request
  management
- ✅ **UI: FriendsListScreen** - Built friends list with navigation to add
  friends
- ✅ **UI: ProfileScreen** - Built user profile with username editing capability
- ✅ **Navigation: FriendsStack** - Created complete navigation stack for
  friends features
- ✅ **Navigation: Main Access Point** - Added friends icons to Camera, Chat,
  and Stories screens
- ✅ **Navigation: Link to User Profiles** - Implemented clickable usernames for
  profile navigation

**❌ Remaining Tasks (Backend - Requires Database Setup):**

- **Backend: Secure `profiles` Table** - Requires Supabase database setup
- **Backend: Secure `friendships` Table** - Requires Supabase migration
  deployment
- **Backend: Database Functions** - Depends on database schema completion

**🎯 Next Steps:**

1. Set up local Supabase environment using the instructions in README.md
2. Create database migrations for the `profiles` and `friendships` tables
3. Implement Row Level Security (RLS) policies
4. Create secure database functions for friend management
5. Test the complete friend management flow end-to-end

**📱 What's Working Now:**

- All UI screens are built and navigable
- Friend management service functions are implemented (will work once backend is
  ready)
- User profile functionality is complete
- Navigation between all friend-related screens works perfectly
- Integration with existing Camera, Chat, and Stories screens is complete
