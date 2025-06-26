-- Create AI conversations table
CREATE TABLE ai_conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT DEFAULT 'untitled conversation',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create AI messages table
CREATE TABLE ai_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
    sender TEXT NOT NULL CHECK (sender IN ('user', 'ai')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create AI posts table
CREATE TABLE ai_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    user_commentary TEXT,
    ai_response TEXT NOT NULL,
    source_link TEXT,
    privacy TEXT NOT NULL DEFAULT 'public' CHECK (privacy IN ('public', 'friends')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ai_conversations
CREATE POLICY "Users can view their own AI conversations" ON ai_conversations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own AI conversations" ON ai_conversations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI conversations" ON ai_conversations
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own AI conversations" ON ai_conversations
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for ai_messages
CREATE POLICY "Users can view messages from their own conversations" ON ai_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM ai_conversations 
            WHERE ai_conversations.id = ai_messages.conversation_id 
            AND ai_conversations.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert messages to their own conversations" ON ai_messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM ai_conversations 
            WHERE ai_conversations.id = ai_messages.conversation_id 
            AND ai_conversations.user_id = auth.uid()
        )
    );

-- RLS Policies for ai_posts
CREATE POLICY "Anyone can view public AI posts" ON ai_posts
    FOR SELECT USING (privacy = 'public');

CREATE POLICY "Users can view friend AI posts if they are friends" ON ai_posts
    FOR SELECT USING (
        privacy = 'friends' AND (
            auth.uid() = user_id OR
            EXISTS (
                SELECT 1 FROM friendships 
                WHERE (
                    (friendships.user_id_1 = auth.uid() AND friendships.user_id_2 = ai_posts.user_id) OR
                    (friendships.user_id_2 = auth.uid() AND friendships.user_id_1 = ai_posts.user_id)
                ) AND friendships.status = 'accepted'
            )
        )
    );

CREATE POLICY "Users can insert their own AI posts" ON ai_posts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI posts" ON ai_posts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own AI posts" ON ai_posts
    FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_ai_conversations_user_id ON ai_conversations(user_id);
CREATE INDEX idx_ai_conversations_created_at ON ai_conversations(created_at DESC);
CREATE INDEX idx_ai_messages_conversation_id ON ai_messages(conversation_id);
CREATE INDEX idx_ai_messages_created_at ON ai_messages(created_at);
CREATE INDEX idx_ai_posts_user_id ON ai_posts(user_id);
CREATE INDEX idx_ai_posts_privacy ON ai_posts(privacy);
CREATE INDEX idx_ai_posts_created_at ON ai_posts(created_at DESC); 