-- Comprehensive Demo Seed Data for SnapConnect
-- This file creates realistic demo data using existing fake profiles
-- Connected to user profile: 97e45081-bc8b-43e6-877e-cf6cf3c5219e

-- Clear existing data (be careful in production!)
DELETE FROM group_read_receipts;
DELETE FROM messages;
DELETE FROM group_members;
DELETE FROM groups;
DELETE FROM chat_participants;
DELETE FROM chats;
DELETE FROM ai_posts;
DELETE FROM ai_messages;
DELETE FROM ai_conversations;
DELETE FROM friendships WHERE user_id_1 = '97e45081-bc8b-43e6-877e-cf6cf3c5219e' OR user_id_2 = '97e45081-bc8b-43e6-877e-cf6cf3c5219e';

-- Upsert fake profiles with finance professional details (insert or update if exists)
INSERT INTO profiles (id, username, score, phone, has_completed_onboarding, created_at) VALUES
('b3ab03b3-a5f7-4b2a-bcee-7586fc92ca3c', 'sarah_trader', 2100, '+15551234568', true, NOW() - INTERVAL '25 days'),
('eeba962f-7cda-40c5-8934-5c5fce228414', 'mike_analyst', 1850, '+15551234569', true, NOW() - INTERVAL '20 days'),
('efc1c8a1-b599-4fa0-9dd7-a33190cfa290', 'emma_portfolio', 2350, '+15551234570', true, NOW() - INTERVAL '18 days'),
('95ab3cf0-446c-4632-baa9-d6a9c9a2a307', 'alex_quant', 1950, '+15551234571', true, NOW() - INTERVAL '15 days'),
('fa813322-e434-43cf-ba56-4c82958570a4', 'lisa_research', 1750, '+15551234572', true, NOW() - INTERVAL '12 days'),
('532a9c65-7c08-4c6b-8353-4920969f04eb', 'david_hedge', 2800, '+15551234573', true, NOW() - INTERVAL '10 days'),
('f355f347-2aef-4c01-90d5-2e6d9526c029', 'rachel_vc', 2200, '+15551234574', true, NOW() - INTERVAL '8 days')
ON CONFLICT (id) DO UPDATE SET
    username = EXCLUDED.username,
    score = EXCLUDED.score,
    phone = EXCLUDED.phone,
    has_completed_onboarding = EXCLUDED.has_completed_onboarding,
    created_at = EXCLUDED.created_at;

-- Create friendships (mutual connections)
INSERT INTO friendships (user_id_1, user_id_2, status, created_at) VALUES
('97e45081-bc8b-43e6-877e-cf6cf3c5219e', 'b3ab03b3-a5f7-4b2a-bcee-7586fc92ca3c', 'accepted', NOW() - INTERVAL '20 days'),
('97e45081-bc8b-43e6-877e-cf6cf3c5219e', 'eeba962f-7cda-40c5-8934-5c5fce228414', 'accepted', NOW() - INTERVAL '18 days'),
('97e45081-bc8b-43e6-877e-cf6cf3c5219e', 'efc1c8a1-b599-4fa0-9dd7-a33190cfa290', 'accepted', NOW() - INTERVAL '15 days'),
('97e45081-bc8b-43e6-877e-cf6cf3c5219e', '95ab3cf0-446c-4632-baa9-d6a9c9a2a307', 'accepted', NOW() - INTERVAL '12 days'),
('97e45081-bc8b-43e6-877e-cf6cf3c5219e', 'fa813322-e434-43cf-ba56-4c82958570a4', 'accepted', NOW() - INTERVAL '10 days'),
('97e45081-bc8b-43e6-877e-cf6cf3c5219e', '532a9c65-7c08-4c6b-8353-4920969f04eb', 'accepted', NOW() - INTERVAL '8 days'),
('97e45081-bc8b-43e6-877e-cf6cf3c5219e', 'f355f347-2aef-4c01-90d5-2e6d9526c029', 'accepted', NOW() - INTERVAL '6 days'),
-- Cross-friendships between fake profiles
('b3ab03b3-a5f7-4b2a-bcee-7586fc92ca3c', 'eeba962f-7cda-40c5-8934-5c5fce228414', 'accepted', NOW() - INTERVAL '15 days'),
('efc1c8a1-b599-4fa0-9dd7-a33190cfa290', '532a9c65-7c08-4c6b-8353-4920969f04eb', 'accepted', NOW() - INTERVAL '12 days'),
('95ab3cf0-446c-4632-baa9-d6a9c9a2a307', 'fa813322-e434-43cf-ba56-4c82958570a4', 'accepted', NOW() - INTERVAL '10 days');

-- Create groups
INSERT INTO groups (id, name, creator_id, created_at) VALUES
(1, 'Market Analysis Team', '97e45081-bc8b-43e6-877e-cf6cf3c5219e', NOW() - INTERVAL '15 days'),
(2, 'Crypto Enthusiasts', 'b3ab03b3-a5f7-4b2a-bcee-7586fc92ca3c', NOW() - INTERVAL '12 days'),
(3, 'Portfolio Managers', 'efc1c8a1-b599-4fa0-9dd7-a33190cfa290', NOW() - INTERVAL '10 days'),
(4, 'Quant Researchers', '95ab3cf0-446c-4632-baa9-d6a9c9a2a307', NOW() - INTERVAL '8 days'),
(5, 'VC Network', 'f355f347-2aef-4c01-90d5-2e6d9526c029', NOW() - INTERVAL '5 days');

-- Add group members
INSERT INTO group_members (group_id, user_id, joined_at) VALUES
-- Market Analysis Team
(1, '97e45081-bc8b-43e6-877e-cf6cf3c5219e', NOW() - INTERVAL '15 days'),
(1, 'b3ab03b3-a5f7-4b2a-bcee-7586fc92ca3c', NOW() - INTERVAL '14 days'),
(1, 'eeba962f-7cda-40c5-8934-5c5fce228414', NOW() - INTERVAL '13 days'),
(1, 'fa813322-e434-43cf-ba56-4c82958570a4', NOW() - INTERVAL '12 days'),

-- Crypto Enthusiasts
(2, '97e45081-bc8b-43e6-877e-cf6cf3c5219e', NOW() - INTERVAL '11 days'),
(2, 'b3ab03b3-a5f7-4b2a-bcee-7586fc92ca3c', NOW() - INTERVAL '12 days'),
(2, 'efc1c8a1-b599-4fa0-9dd7-a33190cfa290', NOW() - INTERVAL '10 days'),
(2, '95ab3cf0-446c-4632-baa9-d6a9c9a2a307', NOW() - INTERVAL '9 days'),

-- Portfolio Managers
(3, '97e45081-bc8b-43e6-877e-cf6cf3c5219e', NOW() - INTERVAL '9 days'),
(3, 'efc1c8a1-b599-4fa0-9dd7-a33190cfa290', NOW() - INTERVAL '10 days'),
(3, '532a9c65-7c08-4c6b-8353-4920969f04eb', NOW() - INTERVAL '8 days'),
(3, 'f355f347-2aef-4c01-90d5-2e6d9526c029', NOW() - INTERVAL '7 days'),

-- Quant Researchers
(4, '97e45081-bc8b-43e6-877e-cf6cf3c5219e', NOW() - INTERVAL '7 days'),
(4, '95ab3cf0-446c-4632-baa9-d6a9c9a2a307', NOW() - INTERVAL '8 days'),
(4, 'eeba962f-7cda-40c5-8934-5c5fce228414', NOW() - INTERVAL '6 days'),
(4, 'fa813322-e434-43cf-ba56-4c82958570a4', NOW() - INTERVAL '5 days'),

-- VC Network
(5, '97e45081-bc8b-43e6-877e-cf6cf3c5219e', NOW() - INTERVAL '4 days'),
(5, 'f355f347-2aef-4c01-90d5-2e6d9526c029', NOW() - INTERVAL '5 days'),
(5, 'efc1c8a1-b599-4fa0-9dd7-a33190cfa290', NOW() - INTERVAL '3 days'),
(5, '532a9c65-7c08-4c6b-8353-4920969f04eb', NOW() - INTERVAL '2 days');

-- Create direct chats
INSERT INTO chats (id, chat_type, created_at) VALUES
(1, 'direct', NOW() - INTERVAL '10 days'),
(2, 'direct', NOW() - INTERVAL '8 days'),
(3, 'direct', NOW() - INTERVAL '6 days'),
(4, 'direct', NOW() - INTERVAL '4 days'),
(5, 'direct', NOW() - INTERVAL '2 days'),
(6, 'group', NOW() - INTERVAL '15 days'),
(7, 'group', NOW() - INTERVAL '12 days'),
(8, 'group', NOW() - INTERVAL '10 days'),
(9, 'group', NOW() - INTERVAL '8 days'),
(10, 'group', NOW() - INTERVAL '5 days');

-- Add chat participants for direct chats
INSERT INTO chat_participants (chat_id, user_id, joined_at) VALUES
(1, '97e45081-bc8b-43e6-877e-cf6cf3c5219e', NOW() - INTERVAL '10 days'),
(1, 'b3ab03b3-a5f7-4b2a-bcee-7586fc92ca3c', NOW() - INTERVAL '10 days'),
(2, '97e45081-bc8b-43e6-877e-cf6cf3c5219e', NOW() - INTERVAL '8 days'),
(2, 'eeba962f-7cda-40c5-8934-5c5fce228414', NOW() - INTERVAL '8 days'),
(3, '97e45081-bc8b-43e6-877e-cf6cf3c5219e', NOW() - INTERVAL '6 days'),
(3, 'efc1c8a1-b599-4fa0-9dd7-a33190cfa290', NOW() - INTERVAL '6 days'),
(4, '97e45081-bc8b-43e6-877e-cf6cf3c5219e', NOW() - INTERVAL '4 days'),
(4, '532a9c65-7c08-4c6b-8353-4920969f04eb', NOW() - INTERVAL '4 days'),
(5, '97e45081-bc8b-43e6-877e-cf6cf3c5219e', NOW() - INTERVAL '2 days'),
(5, 'f355f347-2aef-4c01-90d5-2e6d9526c029', NOW() - INTERVAL '2 days');

-- Add chat participants for group chats
INSERT INTO chat_participants (chat_id, user_id, joined_at) VALUES
-- Market Analysis Team group chat
(6, '97e45081-bc8b-43e6-877e-cf6cf3c5219e', NOW() - INTERVAL '15 days'),
(6, 'b3ab03b3-a5f7-4b2a-bcee-7586fc92ca3c', NOW() - INTERVAL '14 days'),
(6, 'eeba962f-7cda-40c5-8934-5c5fce228414', NOW() - INTERVAL '13 days'),
(6, 'fa813322-e434-43cf-ba56-4c82958570a4', NOW() - INTERVAL '12 days'),

-- Crypto Enthusiasts group chat
(7, '97e45081-bc8b-43e6-877e-cf6cf3c5219e', NOW() - INTERVAL '11 days'),
(7, 'b3ab03b3-a5f7-4b2a-bcee-7586fc92ca3c', NOW() - INTERVAL '12 days'),
(7, 'efc1c8a1-b599-4fa0-9dd7-a33190cfa290', NOW() - INTERVAL '10 days'),
(7, '95ab3cf0-446c-4632-baa9-d6a9c9a2a307', NOW() - INTERVAL '9 days'),

-- Portfolio Managers group chat
(8, '97e45081-bc8b-43e6-877e-cf6cf3c5219e', NOW() - INTERVAL '9 days'),
(8, 'efc1c8a1-b599-4fa0-9dd7-a33190cfa290', NOW() - INTERVAL '10 days'),
(8, '532a9c65-7c08-4c6b-8353-4920969f04eb', NOW() - INTERVAL '8 days'),
(8, 'f355f347-2aef-4c01-90d5-2e6d9526c029', NOW() - INTERVAL '7 days'),

-- Quant Researchers group chat
(9, '97e45081-bc8b-43e6-877e-cf6cf3c5219e', NOW() - INTERVAL '7 days'),
(9, '95ab3cf0-446c-4632-baa9-d6a9c9a2a307', NOW() - INTERVAL '8 days'),
(9, 'eeba962f-7cda-40c5-8934-5c5fce228414', NOW() - INTERVAL '6 days'),
(9, 'fa813322-e434-43cf-ba56-4c82958570a4', NOW() - INTERVAL '5 days'),

-- VC Network group chat
(10, '97e45081-bc8b-43e6-877e-cf6cf3c5219e', NOW() - INTERVAL '4 days'),
(10, 'f355f347-2aef-4c01-90d5-2e6d9526c029', NOW() - INTERVAL '5 days'),
(10, 'efc1c8a1-b599-4fa0-9dd7-a33190cfa290', NOW() - INTERVAL '3 days'),
(10, '532a9c65-7c08-4c6b-8353-4920969f04eb', NOW() - INTERVAL '2 days');

-- Insert direct messages
INSERT INTO messages (chat_id, sender_id, content_type, content_text, created_at) VALUES
-- Chat with Sarah (Trader)
(1, 'b3ab03b3-a5f7-4b2a-bcee-7586fc92ca3c', 'text', 'Hey! Did you see the Fed announcement today? Looks like they''re hinting at rate cuts', NOW() - INTERVAL '2 hours'),
(1, '97e45081-bc8b-43e6-877e-cf6cf3c5219e', 'text', 'Yes! I think this could be huge for growth stocks. What''s your take on tech?', NOW() - INTERVAL '1 hour 45 minutes'),
(1, 'b3ab03b3-a5f7-4b2a-bcee-7586fc92ca3c', 'text', 'I''m bullish on AI companies. NVIDIA and Microsoft look strong', NOW() - INTERVAL '1 hour 30 minutes'),
(1, '97e45081-bc8b-43e6-877e-cf6cf3c5219e', 'text', 'Agreed. I''ve been looking at some smaller AI plays too. Want to discuss over coffee?', NOW() - INTERVAL '1 hour 15 minutes'),

-- Chat with Mike (Analyst)
(2, '97e45081-bc8b-43e6-877e-cf6cf3c5219e', 'text', 'Mike, your Q4 earnings report was spot on. Thanks for sharing!', NOW() - INTERVAL '6 hours'),
(2, 'eeba962f-7cda-40c5-8934-5c5fce228414', 'text', 'Thanks! I think we''re seeing a shift in consumer spending patterns', NOW() - INTERVAL '5 hours 30 minutes'),
(2, 'eeba962f-7cda-40c5-8934-5c5fce228414', 'text', 'Retail is getting hit hard, but services are holding up well', NOW() - INTERVAL '5 hours 15 minutes'),
(2, '97e45081-bc8b-43e6-877e-cf6cf3c5219e', 'text', 'That aligns with what I''m seeing in my portfolio. Any specific sectors you''re watching?', NOW() - INTERVAL '5 hours'),

-- Chat with Emma (Portfolio Manager)
(3, 'efc1c8a1-b599-4fa0-9dd7-a33190cfa290', 'text', 'The market volatility today is insane! VIX is through the roof', NOW() - INTERVAL '3 hours'),
(3, '97e45081-bc8b-43e6-877e-cf6cf3c5219e', 'text', 'I know! Perfect time for some volatility trading strategies', NOW() - INTERVAL '2 hours 45 minutes'),
(3, 'efc1c8a1-b599-4fa0-9dd7-a33190cfa290', 'text', 'Exactly what I was thinking. Iron condors might work well here', NOW() - INTERVAL '2 hours 30 minutes'),

-- Chat with David (Hedge Fund)
(4, '532a9c65-7c08-4c6b-8353-4920969f04eb', 'text', 'Our fund is up 23% YTD. How''s your performance looking?', NOW() - INTERVAL '1 day'),
(4, '97e45081-bc8b-43e6-877e-cf6cf3c5219e', 'text', 'Nice! I''m at 18% - mostly from tech and healthcare plays', NOW() - INTERVAL '23 hours'),
(4, '532a9c65-7c08-4c6b-8353-4920969f04eb', 'text', 'Healthcare has been solid. We''re heavy in biotech right now', NOW() - INTERVAL '22 hours'),

-- Chat with Rachel (VC)
(5, 'f355f347-2aef-4c01-90d5-2e6d9526c029', 'text', 'Exciting fintech startup pitched today. AI-powered trading platform', NOW() - INTERVAL '4 hours'),
(5, '97e45081-bc8b-43e6-877e-cf6cf3c5219e', 'text', 'That space is getting crowded. What''s their differentiation?', NOW() - INTERVAL '3 hours 45 minutes'),
(5, 'f355f347-2aef-4c01-90d5-2e6d9526c029', 'text', 'They''re using quantum computing for risk modeling. Pretty innovative', NOW() - INTERVAL '3 hours 30 minutes');

-- Insert group messages
INSERT INTO messages (group_id, sender_id, content_type, content_text, created_at) VALUES
-- Market Analysis Team
(1, '97e45081-bc8b-43e6-877e-cf6cf3c5219e', 'text', 'Team, let''s discuss the upcoming earnings season. I''ve prepared a watchlist', NOW() - INTERVAL '1 day'),
(1, 'b3ab03b3-a5f7-4b2a-bcee-7586fc92ca3c', 'text', 'Great! I''m particularly interested in the mega-cap tech earnings', NOW() - INTERVAL '23 hours'),
(1, 'eeba962f-7cda-40c5-8934-5c5fce228414', 'text', 'Don''t forget about the energy sector - oil prices are moving', NOW() - INTERVAL '22 hours'),
(1, 'fa813322-e434-43cf-ba56-4c82958570a4', 'text', 'My research shows consumer discretionary might surprise to the upside', NOW() - INTERVAL '21 hours'),

-- Crypto Enthusiasts
(2, 'b3ab03b3-a5f7-4b2a-bcee-7586fc92ca3c', 'text', 'The ETF approval news is huge for Bitcoin! 🚀', NOW() - INTERVAL '6 hours'),
(2, '97e45081-bc8b-43e6-877e-cf6cf3c5219e', 'text', 'Institutional adoption is accelerating faster than I expected', NOW() - INTERVAL '5 hours 45 minutes'),
(2, 'efc1c8a1-b599-4fa0-9dd7-a33190cfa290', 'text', 'What do you all think about Ethereum''s upcoming upgrade?', NOW() - INTERVAL '5 hours 30 minutes'),
(2, '95ab3cf0-446c-4632-baa9-d6a9c9a2a307', 'text', 'Should reduce gas fees significantly. Bullish for DeFi', NOW() - INTERVAL '5 hours 15 minutes'),

-- Portfolio Managers
(3, 'efc1c8a1-b599-4fa0-9dd7-a33190cfa290', 'text', 'Risk management meeting tomorrow at 2 PM. Please review your positions', NOW() - INTERVAL '8 hours'),
(3, '97e45081-bc8b-43e6-877e-cf6cf3c5219e', 'text', 'I''ve been reducing my tech exposure and adding defensive stocks', NOW() - INTERVAL '7 hours 45 minutes'),
(3, '532a9c65-7c08-4c6b-8353-4920969f04eb', 'text', 'Same here. Utilities and consumer staples looking attractive', NOW() - INTERVAL '7 hours 30 minutes'),
(3, 'f355f347-2aef-4c01-90d5-2e6d9526c029', 'text', 'Don''t forget international diversification - emerging markets are cheap', NOW() - INTERVAL '7 hours 15 minutes'),

-- Quant Researchers
(4, '95ab3cf0-446c-4632-baa9-d6a9c9a2a307', 'text', 'New momentum factor model is showing promising backtest results', NOW() - INTERVAL '12 hours'),
(4, '97e45081-bc8b-43e6-877e-cf6cf3c5219e', 'text', 'Interesting! What''s the Sharpe ratio looking like?', NOW() - INTERVAL '11 hours 45 minutes'),
(4, '95ab3cf0-446c-4632-baa9-d6a9c9a2a307', 'text', '1.8 with max drawdown of 12%. Pretty solid for a pure momentum strategy', NOW() - INTERVAL '11 hours 30 minutes'),
(4, 'eeba962f-7cda-40c5-8934-5c5fce228414', 'text', 'Have you tested it across different market regimes?', NOW() - INTERVAL '11 hours 15 minutes'),

-- VC Network
(5, 'f355f347-2aef-4c01-90d5-2e6d9526c029', 'text', 'Exciting fintech startup pitched today. AI-powered trading platform', NOW() - INTERVAL '4 hours'),
(5, '97e45081-bc8b-43e6-877e-cf6cf3c5219e', 'text', 'That space is getting crowded. What''s their differentiation?', NOW() - INTERVAL '3 hours 45 minutes'),
(5, 'efc1c8a1-b599-4fa0-9dd7-a33190cfa290', 'text', 'Hopefully better than the last three we saw 😅', NOW() - INTERVAL '3 hours 30 minutes'),
(5, '532a9c65-7c08-4c6b-8353-4920969f04eb', 'text', 'I''m interested. Can you share the deck?', NOW() - INTERVAL '3 hours 15 minutes');

-- Create AI conversations for your profile
INSERT INTO ai_conversations (id, user_id, title, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', '97e45081-bc8b-43e6-877e-cf6cf3c5219e', 'Tesla Q4 Earnings Analysis', NOW() - INTERVAL '2 days'),
('550e8400-e29b-41d4-a716-446655440002', '97e45081-bc8b-43e6-877e-cf6cf3c5219e', 'Federal Reserve Policy Impact', NOW() - INTERVAL '1 day'),
('550e8400-e29b-41d4-a716-446655440003', '97e45081-bc8b-43e6-877e-cf6cf3c5219e', 'Cryptocurrency Market Trends', NOW() - INTERVAL '12 hours'),
('550e8400-e29b-41d4-a716-446655440004', '97e45081-bc8b-43e6-877e-cf6cf3c5219e', 'ESG Investment Opportunities', NOW() - INTERVAL '6 hours'),
('550e8400-e29b-41d4-a716-446655440005', '97e45081-bc8b-43e6-877e-cf6cf3c5219e', 'AI and Semiconductor Outlook', NOW() - INTERVAL '4 hours');

-- Create AI conversations for fake profiles
INSERT INTO ai_conversations (id, user_id, title, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440006', 'b3ab03b3-a5f7-4b2a-bcee-7586fc92ca3c', 'Options Trading Strategies', NOW() - INTERVAL '3 days'),
('550e8400-e29b-41d4-a716-446655440007', 'eeba962f-7cda-40c5-8934-5c5fce228414', 'Consumer Sector Analysis', NOW() - INTERVAL '2 days'),
('550e8400-e29b-41d4-a716-446655440008', 'efc1c8a1-b599-4fa0-9dd7-a33190cfa290', 'Risk Management Framework', NOW() - INTERVAL '1 day'),
('550e8400-e29b-41d4-a716-446655440009', '95ab3cf0-446c-4632-baa9-d6a9c9a2a307', 'Algorithmic Trading Models', NOW() - INTERVAL '8 hours'),
('550e8400-e29b-41d4-a716-446655440010', 'fa813322-e434-43cf-ba56-4c82958570a4', 'Biotech Investment Thesis', NOW() - INTERVAL '5 hours');

-- Insert AI messages for your conversations
INSERT INTO ai_messages (conversation_id, sender, content, metadata, created_at) VALUES
-- Tesla Q4 Earnings Analysis
('550e8400-e29b-41d4-a716-446655440001', 'user', 'What are the key metrics to watch in Tesla''s Q4 earnings report?', NULL, NOW() - INTERVAL '2 days'),
('550e8400-e29b-41d4-a716-446655440001', 'ai', 'Based on Tesla''s historical performance and current market conditions, here are the key metrics to monitor in their Q4 earnings: Vehicle deliveries (consensus: ~1.8M for full year), automotive revenue growth (expect 15-20% YoY), automotive gross margin (target: >20%), and 2024 delivery guidance. The market will particularly focus on margin sustainability given the aggressive pricing strategy Tesla has employed.', 
'{"sources": [{"url": "https://www.sec.gov/Archives/edgar/data/1318605/000156459024000006/tsla-10k_20231231.htm", "companyName": "Tesla Inc", "filingDate": "2024-01-29", "accessionNumber": "0001564590-24-000006", "filingType": "10-K"}]}', NOW() - INTERVAL '2 days' + INTERVAL '5 minutes'),

-- Federal Reserve Policy Impact
('550e8400-e29b-41d4-a716-446655440002', 'user', 'How will the Fed''s recent policy changes affect different asset classes?', NULL, NOW() - INTERVAL '1 day'),
('550e8400-e29b-41d4-a716-446655440002', 'ai', 'The Federal Reserve''s recent policy stance will have varying impacts across asset classes: Growth stocks likely to benefit from lower discount rates, especially tech and high-multiple stocks. Long-term bonds should see price appreciation as yields decline. REITs benefit from lower discount rates and reduced financing costs. Key sector rotation expected from defensive sectors to cyclical sectors.', 
'{"sources": [{"url": "https://www.sec.gov/Archives/edgar/data/831001/000083100124000021/spx-10k_20231231.htm", "companyName": "S&P Global Inc", "filingDate": "2024-02-15", "accessionNumber": "0000831001-24-000021", "filingType": "10-K"}]}', NOW() - INTERVAL '1 day' + INTERVAL '3 minutes');

-- Insert AI messages for fake profile conversations
INSERT INTO ai_messages (conversation_id, sender, content, metadata, created_at) VALUES
-- Sarah's Options Trading Strategies
('550e8400-e29b-41d4-a716-446655440006', 'user', 'What are the best options strategies for high volatility markets?', NULL, NOW() - INTERVAL '3 days'),
('550e8400-e29b-41d4-a716-446655440006', 'ai', 'In high volatility environments, several options strategies can be effective: Iron condors for range-bound markets, straddles for directional uncertainty, and covered calls for income generation. Volatility sellers generally outperform during these periods, but timing and position sizing are crucial for risk management.', 
'{"sources": [{"url": "https://www.sec.gov/Archives/edgar/data/1067983/000106798324000012/bx-10k_20231231.htm", "companyName": "Blackstone Inc", "filingDate": "2024-02-14", "accessionNumber": "0001067983-24-000012", "filingType": "10-K"}]}', NOW() - INTERVAL '3 days' + INTERVAL '2 minutes'),

-- Mike's Consumer Sector Analysis
('550e8400-e29b-41d4-a716-446655440007', 'user', 'How is the consumer discretionary sector positioned for the next quarter?', NULL, NOW() - INTERVAL '2 days'),
('550e8400-e29b-41d4-a716-446655440007', 'ai', 'Consumer discretionary faces headwinds from elevated interest rates and inflation concerns, but shows resilience in premium segments. E-commerce continues strong growth while traditional retail faces pressure. Key themes include travel recovery, luxury goods demand, and streaming service consolidation.', 
'{"sources": [{"url": "https://www.sec.gov/Archives/edgar/data/320193/000032019324000012/aapl-10k_20230930.htm", "companyName": "Apple Inc", "filingDate": "2024-01-03", "accessionNumber": "0000320193-24-000012", "filingType": "10-K"}]}', NOW() - INTERVAL '2 days' + INTERVAL '1 minute');

-- Create AI posts from various users
INSERT INTO ai_posts (user_id, user_commentary, ai_response, source_link, privacy, metadata, created_at) VALUES
('97e45081-bc8b-43e6-877e-cf6cf3c5219e', 
'Really interesting analysis on Tesla''s margins. The AI highlighted some key risks I hadn''t considered.', 
'Based on Tesla''s historical performance and current market conditions, here are the key metrics to monitor in their Q4 earnings: Vehicle deliveries, automotive revenue growth, and particularly automotive gross margin sustainability given their aggressive pricing strategy.', 
'https://www.sec.gov/Archives/edgar/data/1318605/000156459024000006/tsla-10k_20231231.htm',
'public',
'{"sources": [{"url": "https://www.sec.gov/Archives/edgar/data/1318605/000156459024000006/tsla-10k_20231231.htm", "companyName": "Tesla Inc", "filingDate": "2024-01-29", "accessionNumber": "0001564590-24-000006", "filingType": "10-K"}]}',
NOW() - INTERVAL '1 day'),

('b3ab03b3-a5f7-4b2a-bcee-7586fc92ca3c',
'Options strategies in this volatile market are crucial. Great breakdown from the AI on timing and risk management.',
'In high volatility environments, iron condors for range-bound markets and straddles for directional uncertainty can be effective. Volatility sellers generally outperform during these periods, but timing and position sizing are crucial.',
'https://www.sec.gov/Archives/edgar/data/1067983/000106798324000012/bx-10k_20231231.htm',
'public',
'{"sources": [{"url": "https://www.sec.gov/Archives/edgar/data/1067983/000106798324000012/bx-10k_20231231.htm", "companyName": "Blackstone Inc", "filingDate": "2024-02-14", "accessionNumber": "0001067983-24-000012", "filingType": "10-K"}]}',
NOW() - INTERVAL '8 hours'),

('eeba962f-7cda-40c5-8934-5c5fce228414',
'Consumer trends are shifting rapidly. This analysis helps identify the winners and losers.',
'Consumer discretionary faces headwinds from elevated rates but shows resilience in premium segments. E-commerce continues strong growth while traditional retail faces pressure. Key themes include travel recovery and luxury goods demand.',
'https://www.sec.gov/Archives/edgar/data/320193/000032019324000012/aapl-10k_20230930.htm',
'friends',
'{"sources": [{"url": "https://www.sec.gov/Archives/edgar/data/320193/000032019324000012/aapl-10k_20230930.htm", "companyName": "Apple Inc", "filingDate": "2024-01-03", "accessionNumber": "0000320193-24-000012", "filingType": "10-K"}]}',
NOW() - INTERVAL '6 hours'),

('efc1c8a1-b599-4fa0-9dd7-a33190cfa290',
'Risk management is more important than ever. Portfolio diversification strategies need updating.',
'Modern portfolio theory requires adaptation for current market conditions. Factor-based investing, alternative risk premia, and dynamic hedging strategies can help navigate increased correlation during stress periods.',
'https://www.sec.gov/Archives/edgar/data/1551152/000155115224000008/gs-10k_20231231.htm',
'public',
'{"sources": [{"url": "https://www.sec.gov/Archives/edgar/data/1551152/000155115224000008/gs-10k_20231231.htm", "companyName": "Goldman Sachs Group Inc", "filingDate": "2024-02-16", "accessionNumber": "0001551152-24-000008", "filingType": "10-K"}]}',
NOW() - INTERVAL '4 hours'),

('532a9c65-7c08-4c6b-8353-4920969f04eb',
'Hedge fund strategies are evolving. Alternative data and AI are game changers.',
'Hedge funds increasingly leverage alternative data sources including satellite imagery, social sentiment, and transaction data. Machine learning models for pattern recognition and risk management are becoming standard tools for alpha generation.',
'https://www.sec.gov/Archives/edgar/data/886982/000088698224000009/c-10k_20231231.htm',
'friends',
'{"sources": [{"url": "https://www.sec.gov/Archives/edgar/data/886982/000088698224000009/c-10k_20231231.htm", "companyName": "Citigroup Inc", "filingDate": "2024-02-14", "accessionNumber": "0000886982-24-000009", "filingType": "10-K"}]}',
NOW() - INTERVAL '2 hours');

-- Update group read receipts
INSERT INTO group_read_receipts (group_id, user_id, last_read_at) VALUES
(1, '97e45081-bc8b-43e6-877e-cf6cf3c5219e', NOW() - INTERVAL '30 minutes'),
(1, 'b3ab03b3-a5f7-4b2a-bcee-7586fc92ca3c', NOW() - INTERVAL '1 hour'),
(1, 'eeba962f-7cda-40c5-8934-5c5fce228414', NOW() - INTERVAL '45 minutes'),
(2, '97e45081-bc8b-43e6-877e-cf6cf3c5219e', NOW() - INTERVAL '2 hours'),
(2, 'b3ab03b3-a5f7-4b2a-bcee-7586fc92ca3c', NOW() - INTERVAL '1 hour'),
(3, '97e45081-bc8b-43e6-877e-cf6cf3c5219e', NOW() - INTERVAL '3 hours'),
(4, '97e45081-bc8b-43e6-877e-cf6cf3c5219e', NOW() - INTERVAL '5 hours'),
(5, '97e45081-bc8b-43e6-877e-cf6cf3c5219e', NOW() - INTERVAL '1 hour');

-- Success message
SELECT 'Comprehensive demo seed data has been successfully created with existing fake profiles!' as message; 