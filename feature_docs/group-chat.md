# Feature: Group Chat

## Overview

This document outlines the implementation plan for a new group chat feature. The
feature allows users to create and participate in group conversations with
multiple people.

### Key Decisions & Requirements:

- **Access Point**: The group chat feature will be integrated into the
  `StoriesScreen`. The list of a user's groups will appear below the stories
  section.
- **Creation & Management**:
  - Users can create a group from the `StoriesScreen`.
  - Groups will have a user-defined name.
  - Group avatars will be the first letter of the group's name on a solid blue
    background.
  - All members have equal permissions (no admin roles).
  - Users can leave a group at any time.
  - Members can be added from the platform's entire user base, not just from a
    user's friends list.
- **User Interface**:
  - The `StoriesScreen` will feature pull-to-refresh for the groups list.
  - The group list will show the group avatar, name, the last message sent, and
    the sender's name.
  - A numeric counter will indicate the number of unread messages for each
    group, updated in real-time.
  - The conversation screen will display the sender's avatar and username for
    each message.
- **Technical Implementation**:
  - A new `groupStore.ts` will be created for state management, separate from
    the existing `chatStore.ts`.
  - Supabase Realtime will be used for live message updates.
  - A new service `src/services/groups.ts` will handle all backend
    communication.
  - New database tables (`groups`, `group_members`, `group_read_receipts`) will
    be created via a new migration. The `messages` table will be altered to
    support group messages.
- **Features Not Included (V1)**:
  - Push notifications for group messages.
  - System messages for events like group creation or adding members.
  - Deleting messages.
  - Automatic deletion of empty groups.

---

## Implementation Plan

### Backend

| Priority | Task Description                      | Implementation Details                                                                                                                                                                                        | Code Pointers                     | Dependencies      |
| :------- | :------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :-------------------------------- | :---------------- |
| **P1**   | **Create Database Schema**            | Create `groups` (name, creator) & `group_members` (links users to groups). Alter `messages` table to add a nullable `group_id` with a `CHECK` constraint to ensure a message is either a DM or group message. | `supabase/migrations/` (new file) | -                 |
| **P1**   | **Add Unread Tracking**               | Create a `group_read_receipts` table (`group_id`, `user_id`, `last_read_at`) to track when a user last viewed a group's messages.                                                                             | `supabase/migrations/` (new file) | Schema Changes    |
| **P1**   | **Implement Core DB Functions**       | Create Supabase RPC functions: `create_group`, `send_group_message`, `get_group_messages`, and `get_user_groups` (fetches a user's groups with last message and unread count).                                | `supabase/migrations/` (new file) | Schema Changes    |
| **P1**   | **Enable Realtime**                   | Enable Supabase Realtime on the `messages` table filtered by `group_id` to deliver new messages instantly.                                                                                                    | Supabase Dashboard Settings       | `messages` table  |
| **P2**   | **Implement Management DB Functions** | Create RPC functions for `add_group_members` and `leave_group`.                                                                                                                                               | `supabase/migrations/` (new file) | Core Group Schema |
| **P2**   | **Implement Row-Level Security**      | Add RLS policies to ensure users can only access and manage groups they are members of.                                                                                                                       | `supabase/migrations/` (new file) | Schema Changes    |

### Frontend

| Priority | Task Description              | Implementation Details                                                                                                                                                                       | Code Pointers                                                                                  | Dependencies                         |
| :------- | :---------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------- | :----------------------------------- |
| **P1**   | **Create Types & Store**      | Create `src/types/groups.ts` and a new Zustand store at `src/stores/groupStore.ts` for managing group state and messages.                                                                    | `src/types/`, `src/stores/`                                                                    | -                                    |
| **P1**   | **Create Service Layer**      | Create `src/services/groups.ts` to provide an interface between the frontend and the backend Supabase functions.                                                                             | `src/services/groups.ts`                                                                       | Backend DB Functions                 |
| **P1**   | **Navigation**                | Add new screens to the navigation stack: `CreateGroupScreen`, `GroupConversationScreen`, `AddGroupMembersScreen`.                                                                            | `src/navigation/`                                                                              | -                                    |
| **P1**   | **Create Group Screen**       | Build a UI to set a group name and search/select initial members from all platform users, similar to the `AddFriendScreen`.                                                                  | `src/screens/CreateGroupScreen/`                                                               | `groups.ts` service                  |
| **P1**   | **Group Conversation Screen** | Build the chat UI. Display messages with the sender's avatar (blue background) and username. Subscribe to realtime for live message updates.                                                 | `src/screens/GroupConversationScreen/`                                                         | `groupStore.ts`, `groups.ts` service |
| **P2**   | **Update Stories Screen**     | Below stories, display a list of groups with their avatar, name, last message, sender, and an unread message count. Add pull-to-refresh and a "Create Group" button. Include an empty state. | `src/screens/StoriesScreen/`                                                                   | `groups.ts` service                  |
| **P2**   | **Group Details/Management**  | From the conversation screen header, open a view showing group members and providing buttons to "Add Members" (navigating to a user selection screen) and "Leave Group."                     | `src/screens/GroupConversationScreen/` (add header icon), `src/screens/AddGroupMembersScreen/` | `groups.ts` service                  |
