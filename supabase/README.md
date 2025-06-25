# SnapConnect Supabase Setup

This directory contains the database migrations and configuration for the SnapConnect application's Supabase backend.

## Overview

SnapConnect uses Supabase as its backend-as-a-service platform, providing:
- **Authentication**: User signup/login with email/password
- **Database**: PostgreSQL with Row Level Security (RLS)
- **Realtime**: WebSocket connections for live chat
- **Storage**: File storage for photos and videos
- **Edge Functions**: Serverless functions for complex operations

## Local Development Setup

### Prerequisites

1. **Docker Desktop**: Required for running Supabase locally
2. **Supabase CLI**: Install via npm or your package manager
   ```bash
   npm install -g supabase
   # or
   brew install supabase/tap/supabase
   ```

### Getting Started

1. **Initialize Supabase** (if not already done):
   ```bash
   supabase init
   ```

2. **Start the local Supabase stack**:
   ```bash
   supabase start
   ```
   This will start all Supabase services locally:
   - API: http://localhost:54321
   - Studio: http://localhost:54323
   - Database: postgresql://postgres:postgres@localhost:54322/postgres

3. **Apply migrations**:
   ```bash
   supabase db reset
   ```
   This will run all migrations and seed data.

4. **View the database**:
   Open http://localhost:54323 to access Supabase Studio locally.

### Environment Variables

Make sure your `.env` file contains the local Supabase configuration:

```env
EXPO_PUBLIC_SUPABASE_URL=http://localhost:54321
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_local_anon_key
```

You can get the anon key by running:
```bash
supabase status
```

## Database Schema

### Core Tables

#### `profiles`
- **Purpose**: User profile information
- **Key Fields**: `id` (UUID), `username`, `score`, `created_at`, `updated_at`
- **Security**: RLS enabled, users can view all profiles but only update their own

#### `friendships`
- **Purpose**: Friend relationships and requests
- **Key Fields**: `user_id_1`, `user_id_2`, `status` ('pending', 'accepted', 'blocked')
- **Security**: RLS enabled, users can only see their own friendships

#### `chats` & `chat_participants`
- **Purpose**: Chat conversations and participants
- **Security**: RLS enabled, users can only access chats they participate in

#### `messages`
- **Purpose**: Chat messages (text, images, videos)
- **TTL**: Messages disappear after 24 hours via RLS policy
- **Security**: Users can only see messages in their chats

#### `stories`
- **Purpose**: Ephemeral stories (photos/videos)
- **TTL**: Stories disappear after 24 hours via RLS policy
- **Privacy**: Can be 'public' or 'private_friends'

### Security Model

All tables use **Row Level Security (RLS)** to ensure data privacy:

- **Authentication Required**: All policies require `auth.uid()` (authenticated user)
- **Ownership-Based**: Users can only modify their own data
- **Relationship-Based**: Access to shared content (messages, stories) based on friendships
- **Time-Based**: Ephemeral content automatically expires after 24 hours

### Database Functions

#### User Management
- `update_username(new_username)`: Safely update username with validation
- `increment_user_score(user_id, points)`: Increment user engagement score

#### Friend Management
- `accept_friend_request(request_id)`: Accept a pending friend request
- `decline_friend_request(request_id)`: Decline a pending friend request
- `get_suggested_friends(limit_count)`: Get random users to suggest as friends

#### Messaging
- `create_direct_chat(other_user_id)`: Create or get existing chat between friends
- `get_user_chats()`: Get user's chat list with latest message info

## Development Workflow

### Making Schema Changes

1. **Create a new migration**:
   ```bash
   supabase migration new your_migration_name
   ```

2. **Edit the migration file** in `supabase/migrations/`

3. **Apply the migration**:
   ```bash
   supabase db reset
   ```

4. **Test your changes** in Supabase Studio

### Working with Seed Data

The `seed.sql` file contains test data for development:
- Test users: johnny_creator, timmy_student, sarah_trader
- Sample friendships and friend requests
- Additional users for testing friend suggestions

To reload seed data:
```bash
supabase db reset
```

### Connecting to Production

1. **Link to your Supabase project**:
   ```bash
   supabase link --project-ref your-project-ref
   ```

2. **Deploy migrations**:
   ```bash
   supabase db push
   ```

3. **Update environment variables** to use production URLs

## Testing

### Manual Testing

1. **Start local Supabase**: `supabase start`
2. **Open Studio**: http://localhost:54323
3. **Test authentication**: Create test users via the Auth tab
4. **Test RLS policies**: Try queries as different users
5. **Test functions**: Use the SQL editor to call database functions

### Automated Testing

You can write SQL tests in the `supabase/tests/` directory:

```sql
-- Example test file: supabase/tests/test_friendships.sql
BEGIN;
SELECT plan(3);

-- Test friend request creation
SELECT ok(
    (SELECT count(*) FROM friendships WHERE status = 'pending') > 0,
    'Friend requests can be created'
);

-- Add more tests...

SELECT * FROM finish();
ROLLBACK;
```

Run tests with:
```bash
supabase test db
```

## Troubleshooting

### Common Issues

1. **Port conflicts**: If ports 54321-54324 are in use, stop other services or modify `config.toml`

2. **Docker issues**: Make sure Docker Desktop is running and has sufficient resources

3. **Migration errors**: Check the migration SQL syntax and ensure proper permissions

4. **RLS policy errors**: Test policies carefully - overly restrictive policies can break functionality

### Useful Commands

```bash
# Check status of all services
supabase status

# Stop all services
supabase stop

# Reset database (applies all migrations and seed data)
supabase db reset

# Generate TypeScript types
supabase gen types typescript --local > src/types/supabase.ts

# View logs
supabase logs
```

## Production Considerations

### Performance
- Indexes are created for all frequently queried columns
- RLS policies are optimized to avoid N+1 queries
- Consider connection pooling for high traffic

### Security
- All sensitive operations use `SECURITY DEFINER` functions
- RLS policies enforce data isolation
- Regular security audits of policies recommended

### Monitoring
- Set up alerts for database performance
- Monitor RLS policy performance
- Track user engagement via score metrics

## Contributing

When adding new features:

1. Create focused migrations (one feature per migration)
2. Include proper RLS policies for all new tables
3. Add comprehensive comments and documentation
4. Test with seed data before deploying
5. Update this README with new functionality 