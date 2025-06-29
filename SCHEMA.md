### Database Schema

-- WARNING: This schema is for context only and is not meant to be run. -- Table
order and constraints may not be valid for execution.

CREATE TABLE public.ai_conversations ( id uuid NOT NULL DEFAULT
gen_random_uuid(), user_id uuid NOT NULL, title text DEFAULT 'untitled
conversation'::text, created_at timestamp with time zone DEFAULT now(),
CONSTRAINT ai_conversations_pkey PRIMARY KEY (id), CONSTRAINT
ai_conversations_user_id_fkey FOREIGN KEY (user_id) REFERENCES
public.profiles(id) ); CREATE TABLE public.ai_messages ( id uuid NOT NULL
DEFAULT gen_random_uuid(), conversation_id uuid NOT NULL, sender text NOT NULL
CHECK (sender = ANY (ARRAY['user'::text, 'ai'::text])), content text NOT NULL,
created_at timestamp with time zone DEFAULT now(), metadata jsonb, CONSTRAINT
ai_messages_pkey PRIMARY KEY (id), CONSTRAINT ai_messages_conversation_id_fkey
FOREIGN KEY (conversation_id) REFERENCES public.ai_conversations(id) ); CREATE
TABLE public.ai_posts ( id uuid NOT NULL DEFAULT gen_random_uuid(), user_id uuid
NOT NULL, user_commentary text, ai_response text NOT NULL, source_link text,
privacy text NOT NULL DEFAULT 'public'::text CHECK (privacy = ANY
(ARRAY['public'::text, 'friends'::text])), created_at timestamp with time zone
DEFAULT now(), metadata jsonb, CONSTRAINT ai_posts_pkey PRIMARY KEY (id),
CONSTRAINT ai_posts_user_id_fkey FOREIGN KEY (user_id) REFERENCES
public.profiles(id) ); CREATE TABLE public.chat_participants ( chat_id bigint
NOT NULL, user_id uuid NOT NULL, joined_at timestamp with time zone NOT NULL
DEFAULT now(), CONSTRAINT chat_participants_pkey PRIMARY KEY (chat_id, user_id),
CONSTRAINT chat_participants_chat_id_fkey FOREIGN KEY (chat_id) REFERENCES
public.chats(id), CONSTRAINT chat_participants_user_id_fkey FOREIGN KEY
(user_id) REFERENCES public.profiles(id) ); CREATE TABLE public.chats ( id
bigint NOT NULL DEFAULT nextval('chats_id_seq'::regclass), created_at timestamp
with time zone NOT NULL DEFAULT now(), updated_at timestamp with time zone NOT
NULL DEFAULT now(), chat_type text NOT NULL DEFAULT 'direct'::text, CONSTRAINT
chats_pkey PRIMARY KEY (id) ); CREATE TABLE public.friendships ( id bigint NOT
NULL DEFAULT nextval('friendships_id_seq'::regclass), user_id_1 uuid NOT NULL,
user_id_2 uuid NOT NULL, status text NOT NULL CHECK (status = ANY
(ARRAY['pending'::text, 'accepted'::text, 'blocked'::text])), created_at
timestamp with time zone NOT NULL DEFAULT now(), updated_at timestamp with time
zone NOT NULL DEFAULT now(), CONSTRAINT friendships_pkey PRIMARY KEY (id),
CONSTRAINT friendships_user_id_1_fkey FOREIGN KEY (user_id_1) REFERENCES
public.profiles(id), CONSTRAINT friendships_user_id_2_fkey FOREIGN KEY
(user_id_2) REFERENCES public.profiles(id) ); CREATE TABLE public.group_members
( group_id bigint NOT NULL, user_id uuid NOT NULL, joined_at timestamp with time
zone NOT NULL DEFAULT now(), CONSTRAINT group_members_pkey PRIMARY KEY
(group_id, user_id), CONSTRAINT group_members_group_id_fkey FOREIGN KEY
(group_id) REFERENCES public.groups(id), CONSTRAINT group_members_user_id_fkey
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ); CREATE TABLE
public.group_read_receipts ( group_id bigint NOT NULL, user_id uuid NOT NULL,
last_read_at timestamp with time zone NOT NULL DEFAULT now(), CONSTRAINT
group_read_receipts_pkey PRIMARY KEY (group_id, user_id), CONSTRAINT
group_read_receipts_group_id_fkey FOREIGN KEY (group_id) REFERENCES
public.groups(id), CONSTRAINT group_read_receipts_user_id_fkey FOREIGN KEY
(user_id) REFERENCES public.profiles(id) ); CREATE TABLE public.groups ( id
bigint NOT NULL DEFAULT nextval('groups_id_seq'::regclass), name text NOT NULL,
creator_id uuid NOT NULL, created_at timestamp with time zone NOT NULL DEFAULT
now(), updated_at timestamp with time zone NOT NULL DEFAULT now(), CONSTRAINT
groups_pkey PRIMARY KEY (id), CONSTRAINT groups_creator_id_fkey FOREIGN KEY
(creator_id) REFERENCES public.profiles(id) ); CREATE TABLE public.messages ( id
bigint NOT NULL DEFAULT nextval('messages_id_seq'::regclass), chat_id bigint,
sender_id uuid NOT NULL, content_type text NOT NULL CHECK (content_type = ANY
(ARRAY['text'::text, 'image'::text, 'video'::text])), content_text text,
storage_path text, created_at timestamp with time zone NOT NULL DEFAULT now(),
viewed_at timestamp with time zone, group_id bigint, CONSTRAINT messages_pkey
PRIMARY KEY (id), CONSTRAINT messages_chat_id_fkey FOREIGN KEY (chat_id)
REFERENCES public.chats(id), CONSTRAINT messages_sender_id_fkey FOREIGN KEY
(sender_id) REFERENCES public.profiles(id), CONSTRAINT messages_group_id_fkey
FOREIGN KEY (group_id) REFERENCES public.groups(id) ); CREATE TABLE
public.profiles ( id uuid NOT NULL, username text NOT NULL UNIQUE CHECK
(char_length(username) >= 3 AND char_length(username) <= 30), score integer NOT
NULL DEFAULT 0 CHECK (score >= 0), created_at timestamp with time zone NOT NULL
DEFAULT now(), updated_at timestamp with time zone NOT NULL DEFAULT now(), phone
text CHECK (phone IS NULL OR phone ~ '^\+?[1-9]\d{1,14}$'::text),
has_completed_onboarding boolean NOT NULL DEFAULT false, CONSTRAINT
profiles_pkey PRIMARY KEY (id), CONSTRAINT profiles_id_fkey FOREIGN KEY (id)
REFERENCES auth.users(id) ); CREATE TABLE public.stories ( id bigint NOT NULL
DEFAULT nextval('stories_id_seq'::regclass), author_id uuid NOT NULL,
storage_path text NOT NULL, privacy text NOT NULL CHECK (privacy = ANY
(ARRAY['public'::text, 'private_friends'::text])), created_at timestamp with
time zone NOT NULL DEFAULT now(), media_type text NOT NULL CHECK (media_type =
ANY (ARRAY['image'::text, 'video'::text])), width integer, height integer,
duration integer, CONSTRAINT stories_pkey PRIMARY KEY (id), CONSTRAINT
stories_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.profiles(id) );
CREATE TABLE public.story_views ( story_id bigint NOT NULL, user_id uuid NOT
NULL, viewed_at timestamp with time zone NOT NULL DEFAULT now(), CONSTRAINT
story_views_pkey PRIMARY KEY (story_id, user_id), CONSTRAINT
story_views_story_id_fkey FOREIGN KEY (story_id) REFERENCES public.stories(id),
CONSTRAINT story_views_user_id_fkey FOREIGN KEY (user_id) REFERENCES
public.profiles(id) );
