-- Demo Seed Data for SnapConnect
-- This file creates realistic demo data for showcasing the app
-- Connected to user profile: 97e45081-bc8b-43e6-877e-cf6cf3c5219e

-- Clear existing data (be careful in production!)
DELETE FROM story_views;
DELETE FROM stories;
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

-- Note: We're only creating AI conversations and posts for the existing user
-- since other profiles would require auth.users entries

-- Create AI conversations
INSERT INTO ai_conversations (id, user_id, title, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', '97e45081-bc8b-43e6-877e-cf6cf3c5219e', 'Tesla Q4 Earnings Analysis', NOW() - INTERVAL '2 days'),
('550e8400-e29b-41d4-a716-446655440002', '97e45081-bc8b-43e6-877e-cf6cf3c5219e', 'Federal Reserve Policy Impact', NOW() - INTERVAL '1 day'),
('550e8400-e29b-41d4-a716-446655440003', '97e45081-bc8b-43e6-877e-cf6cf3c5219e', 'Cryptocurrency Market Trends', NOW() - INTERVAL '12 hours'),
('550e8400-e29b-41d4-a716-446655440004', '97e45081-bc8b-43e6-877e-cf6cf3c5219e', 'ESG Investment Opportunities', NOW() - INTERVAL '6 hours'),
('550e8400-e29b-41d4-a716-446655440005', '97e45081-bc8b-43e6-877e-cf6cf3c5219e', 'AI and Semiconductor Outlook', NOW() - INTERVAL '4 hours'),
('550e8400-e29b-41d4-a716-446655440006', '97e45081-bc8b-43e6-877e-cf6cf3c5219e', 'Healthcare Sector Analysis', NOW() - INTERVAL '2 hours'),
('550e8400-e29b-41d4-a716-446655440007', '97e45081-bc8b-43e6-877e-cf6cf3c5219e', 'Energy Transition Investments', NOW() - INTERVAL '1 hour');

-- Insert AI messages with realistic finance content
INSERT INTO ai_messages (conversation_id, sender, content, metadata, created_at) VALUES
-- Tesla Q4 Earnings Analysis
('550e8400-e29b-41d4-a716-446655440001', 'user', 'What are the key metrics to watch in Tesla''s Q4 earnings report?', NULL, NOW() - INTERVAL '2 days'),
('550e8400-e29b-41d4-a716-446655440001', 'ai', 'Based on Tesla''s historical performance and current market conditions, here are the key metrics to monitor in their Q4 earnings:

**Revenue & Delivery Metrics:**
- Vehicle deliveries (consensus: ~1.8M for full year)
- Automotive revenue growth (expect 15-20% YoY)
- Energy business revenue (storage + solar)

**Profitability Indicators:**
- Automotive gross margin (target: >20%)
- Operating margin sustainability
- Free cash flow generation

**Forward-Looking Factors:**
- 2024 delivery guidance
- Cybertruck production ramp timeline
- FSD (Full Self-Driving) revenue recognition
- Supercharger network expansion plans

**Risk Factors:**
- Price cut impacts on margins
- Competition in EV space intensifying
- Regulatory changes in key markets

The market will particularly focus on margin sustainability given the aggressive pricing strategy Tesla has employed to maintain market share.', 
'{"sources": [{"url": "https://www.sec.gov/Archives/edgar/data/1318605/000156459024000006/tsla-10k_20231231.htm", "companyName": "Tesla Inc", "filingDate": "2024-01-29", "accessionNumber": "0001564590-24-000006", "filingType": "10-K"}]}', NOW() - INTERVAL '2 days' + INTERVAL '5 minutes'),

-- Federal Reserve Policy Impact
('550e8400-e29b-41d4-a716-446655440002', 'user', 'How will the Fed''s recent policy changes affect different asset classes?', NULL, NOW() - INTERVAL '1 day'),
('550e8400-e29b-41d4-a716-446655440002', 'ai', 'The Federal Reserve''s recent policy stance will have varying impacts across asset classes:

**Equities:**
- **Growth Stocks**: Likely to benefit from lower discount rates, especially tech and high-multiple stocks
- **Value Stocks**: May underperform as lower rates reduce the appeal of dividend yields
- **Small Caps**: Historically outperform in early rate-cutting cycles due to reduced borrowing costs

**Fixed Income:**
- **Long-term Bonds**: Expect price appreciation as yields decline
- **Credit Spreads**: Should tighten as risk appetite increases
- **TIPS**: May underperform if inflation expectations moderate

**Alternative Assets:**
- **REITs**: Benefit from lower discount rates and reduced financing costs
- **Commodities**: Mixed impact - lower dollar may support prices, but reduced growth expectations could weigh
- **Gold**: Typically positive as real yields decline

**Currency Effects:**
- Dollar likely to weaken against major currencies
- Emerging market currencies may strengthen

**Sector Rotation Expected:**
- From defensive sectors (utilities, consumer staples) to cyclical sectors (technology, consumer discretionary)
- Interest-sensitive sectors (real estate, utilities) to outperform

The key risk is if the Fed cuts too aggressively, potentially signaling economic weakness rather than proactive policy management.', 
'{"sources": [{"url": "https://www.sec.gov/Archives/edgar/data/831001/000083100124000021/spx-10k_20231231.htm", "companyName": "S&P Global Inc", "filingDate": "2024-02-15", "accessionNumber": "0000831001-24-000021", "filingType": "10-K"}]}', NOW() - INTERVAL '1 day' + INTERVAL '3 minutes'),

-- Cryptocurrency Market Trends
('550e8400-e29b-41d4-a716-446655440003', 'user', 'What are the current trends driving the cryptocurrency market?', NULL, NOW() - INTERVAL '12 hours'),
('550e8400-e29b-41d4-a716-446655440003', 'ai', 'Several key trends are currently shaping the cryptocurrency market:

**Institutional Adoption:**
- Bitcoin ETF approvals driving institutional inflows
- Corporate treasury adoption (MicroStrategy, Tesla precedent)
- Traditional finance integration accelerating

**Regulatory Clarity:**
- Clearer regulatory frameworks emerging globally
- US regulatory environment improving post-election
- European MiCA regulation providing structure

**Technology Developments:**
- Ethereum''s continued scaling solutions (Layer 2s)
- Bitcoin Lightning Network growth
- DeFi protocol maturation and institutional adoption

**Macroeconomic Factors:**
- Correlation with traditional markets decreasing
- Digital gold narrative strengthening
- Inflation hedge positioning

**Market Structure Evolution:**
- Increased derivatives trading and hedging
- Professional market makers entering
- Reduced retail speculation, more institutional flow

**Emerging Themes:**
- Real World Asset (RWA) tokenization
- Central Bank Digital Currencies (CBDCs)
- AI and blockchain convergence

**Risk Factors:**
- Regulatory changes in key jurisdictions
- Technology risks and smart contract vulnerabilities
- Market manipulation concerns in smaller assets

The overall trend suggests maturation toward a more institutional, regulated asset class while maintaining innovation in underlying technology applications.', 
'{"sources": [{"url": "https://www.sec.gov/Archives/edgar/data/1467858/000146785824000008/coin-10k_20231231.htm", "companyName": "Coinbase Global Inc", "filingDate": "2024-02-15", "accessionNumber": "0001467858-24-000008", "filingType": "10-K"}]}', NOW() - INTERVAL '12 hours' + INTERVAL '2 minutes'),

-- ESG Investment Opportunities
('550e8400-e29b-41d4-a716-446655440004', 'user', 'What are the best ESG investment opportunities in the current market?', NULL, NOW() - INTERVAL '6 hours'),
('550e8400-e29b-41d4-a716-446655440004', 'ai', 'Current ESG investment landscape offers several compelling opportunities:

**Renewable Energy Transition:**
- Solar and wind technology companies with improving cost structures
- Energy storage solutions (battery technology, grid-scale storage)
- Smart grid and energy efficiency technologies

**Sustainable Transportation:**
- Electric vehicle manufacturers with strong fundamentals
- Battery technology and charging infrastructure
- Public transportation and logistics optimization

**Circular Economy:**
- Waste management and recycling technology
- Sustainable packaging solutions
- Water treatment and conservation

**Social Impact Sectors:**
- Healthcare accessibility and innovation
- Education technology and workforce development
- Financial inclusion and fintech solutions

**Governance Leaders:**
- Companies with strong ESG governance scores
- Diverse leadership and transparent reporting
- Stakeholder capitalism adopters

**Investment Vehicles:**
- ESG-focused ETFs with low expense ratios
- Green bonds from high-quality issuers
- Impact investing funds with measurable outcomes

**Emerging Opportunities:**
- Carbon capture and storage technology
- Sustainable agriculture and alternative proteins
- Climate adaptation infrastructure

**Key Considerations:**
- Avoid "greenwashing" - focus on companies with measurable impact
- Consider ESG integration rather than pure exclusion strategies
- Monitor regulatory support and policy tailwinds
- Evaluate long-term demographic and societal trends

The key is balancing financial returns with genuine environmental and social impact, focusing on companies positioned to benefit from the global sustainability transition.', 
'{"sources": [{"url": "https://www.sec.gov/Archives/edgar/data/1652044/000165204424000017/googl-10k_20231231.htm", "companyName": "Alphabet Inc", "filingDate": "2024-01-30", "accessionNumber": "0001652044-24-000017", "filingType": "10-K"}]}', NOW() - INTERVAL '6 hours' + INTERVAL '1 minute'),

-- AI and Semiconductor Outlook
('550e8400-e29b-41d4-a716-446655440005', 'user', 'What''s the outlook for AI and semiconductor investments?', NULL, NOW() - INTERVAL '4 hours'),
('550e8400-e29b-41d4-a716-446655440005', 'ai', 'The AI and semiconductor sector presents compelling long-term opportunities with enterprise AI adoption accelerating and GPU demand remaining strong. However, current multiples reflect high growth expectations and investors should diversify across the AI value chain.', 
'{"sources": [{"url": "https://www.sec.gov/Archives/edgar/data/1045810/000104581024000017/nvda-10k_20240128.htm", "companyName": "NVIDIA Corp", "filingDate": "2024-02-21", "accessionNumber": "0001045810-24-000017", "filingType": "10-K"}]}', NOW() - INTERVAL '4 hours' + INTERVAL '2 minutes'),

-- Healthcare Sector Analysis
('550e8400-e29b-41d4-a716-446655440006', 'user', 'How should I position my portfolio in healthcare given current trends?', NULL, NOW() - INTERVAL '2 hours'),
('550e8400-e29b-41d4-a716-446655440006', 'ai', 'Healthcare sector offers defensive characteristics with growth potential from aging demographics and innovation. Overweight innovative biotechs with strong pipelines while many are trading below historical multiples.', 
'{"sources": [{"url": "https://www.sec.gov/Archives/edgar/data/200406/000020040624000012/jnj-10k_20231231.htm", "companyName": "Johnson & Johnson", "filingDate": "2024-02-13", "accessionNumber": "0000200406-24-000012", "filingType": "10-K"}]}', NOW() - INTERVAL '2 hours' + INTERVAL '3 minutes'),

-- Energy Transition Investments
('550e8400-e29b-41d4-a716-446655440007', 'user', 'What are the best opportunities in the energy transition space?', NULL, NOW() - INTERVAL '1 hour'),
('550e8400-e29b-41d4-a716-446655440007', 'ai', 'The energy transition presents diverse investment opportunities across the value chain:

**Renewable Generation:**
- Solar panel manufacturers with improving efficiency
- Offshore wind developers and equipment suppliers
- Utility-scale battery storage systems
- Grid-scale renewable project developers

**Infrastructure & Grid:**
- Smart grid technology and automation
- Transmission and distribution upgrades
- Energy management software platforms
- Grid-scale energy storage solutions

**Transportation Electrification:**
- EV charging infrastructure networks
- Electric commercial vehicle manufacturers
- Battery technology and recycling
- Autonomous electric vehicle platforms

**Industrial Decarbonization:**
- Green hydrogen production and infrastructure
- Carbon capture, utilization, and storage (CCUS)
- Industrial heat pumps and efficiency solutions
- Sustainable aviation fuels and shipping

**Critical Materials:**
- Lithium, cobalt, and rare earth mining
- Battery recycling and circular economy
- Copper and aluminum for electrification
- Advanced materials for renewable technologies

**Financial Mechanisms:**
- Green bonds and transition financing
- Carbon credit trading platforms
- ESG-focused investment funds
- Renewable energy project finance

**Geographic Considerations:**
- US: IRA incentives driving domestic manufacturing
- Europe: Green Deal and REPowerEU initiatives
- Asia: Manufacturing scale and supply chain dominance
- Emerging markets: Leapfrog technology adoption

**Investment Strategy:**
- Diversify across technologies and geographies
- Focus on companies with competitive advantages
- Consider both pure-plays and traditional energy transitioning
- Monitor policy support and regulatory changes

The transition requires massive capital deployment, creating opportunities for investors willing to navigate technological and regulatory risks while supporting global decarbonization goals.', 
'{"sources": [{"url": "https://www.sec.gov/Archives/edgar/data/1841245/000184124524000008/nee-10k_20231231.htm", "companyName": "NextEra Energy Inc", "filingDate": "2024-02-16", "accessionNumber": "0001841245-24-000008", "filingType": "10-K"}]}', NOW() - INTERVAL '1 hour' + INTERVAL '4 minutes');

-- Create AI posts
INSERT INTO ai_posts (user_id, user_commentary, ai_response, source_link, privacy, metadata, created_at) VALUES
('97e45081-bc8b-43e6-877e-cf6cf3c5219e', 
'Really interesting analysis on Tesla''s margins. The AI highlighted some key risks I hadn''t considered.', 
'Based on Tesla''s historical performance and current market conditions, here are the key metrics to monitor in their Q4 earnings: Vehicle deliveries, automotive revenue growth, and particularly automotive gross margin sustainability given their aggressive pricing strategy.', 
'https://www.sec.gov/Archives/edgar/data/1318605/000156459024000006/tsla-10k_20231231.htm',
'public',
'{"sources": [{"url": "https://www.sec.gov/Archives/edgar/data/1318605/000156459024000006/tsla-10k_20231231.htm", "companyName": "Tesla Inc", "filingDate": "2024-01-29", "accessionNumber": "0001564590-24-000006", "filingType": "10-K"}]}',
NOW() - INTERVAL '1 day'),

('97e45081-bc8b-43e6-877e-cf6cf3c5219e',
'Fed policy changes are going to reshape the entire market. This breakdown is incredibly helpful.',
'The Federal Reserve''s recent policy stance will have varying impacts: Growth stocks likely to benefit from lower discount rates, while long-term bonds should see price appreciation as yields decline. Key sector rotation expected from defensive to cyclical sectors.',
'https://www.sec.gov/Archives/edgar/data/831001/000083100124000021/spx-10k_20231231.htm',
'public',
'{"sources": [{"url": "https://www.sec.gov/Archives/edgar/data/831001/000083100124000021/spx-10k_20231231.htm", "companyName": "S&P Global Inc", "filingDate": "2024-02-15", "accessionNumber": "0000831001-24-000021", "filingType": "10-K"}]}',
NOW() - INTERVAL '8 hours'),

('97e45081-bc8b-43e6-877e-cf6cf3c5219e',
'The institutional adoption trend in crypto is undeniable. Great insights on market maturation.',
'Several key trends are shaping cryptocurrency: Bitcoin ETF approvals driving institutional inflows, clearer regulatory frameworks emerging globally, and overall trend toward maturation as a more institutional, regulated asset class.',
'https://www.sec.gov/Archives/edgar/data/1467858/000146785824000008/coin-10k_20231231.htm',
'public',
'{"sources": [{"url": "https://www.sec.gov/Archives/edgar/data/1467858/000146785824000008/coin-10k_20231231.htm", "companyName": "Coinbase Global Inc", "filingDate": "2024-02-15", "accessionNumber": "0001467858-24-000008", "filingType": "10-K"}]}',
NOW() - INTERVAL '4 hours'),

('97e45081-bc8b-43e6-877e-cf6cf3c5219e',
'AI and semiconductor outlook is fascinating. The growth potential is massive but valuation concerns are real.',
'The AI and semiconductor sector presents compelling long-term opportunities with enterprise AI adoption accelerating and GPU demand remaining strong. However, current multiples reflect high growth expectations and investors should diversify across the AI value chain.',
'https://www.sec.gov/Archives/edgar/data/1045810/000104581024000017/nvda-10k_20240128.htm',
'friends',
'{"sources": [{"url": "https://www.sec.gov/Archives/edgar/data/1045810/000104581024000017/nvda-10k_20240128.htm", "companyName": "NVIDIA Corp", "filingDate": "2024-02-21", "accessionNumber": "0001045810-24-000017", "filingType": "10-K"}]}',
NOW() - INTERVAL '2 hours'),

('97e45081-bc8b-43e6-877e-cf6cf3c5219e',
'Healthcare positioning strategy makes sense given demographic trends. Biotech valuations look attractive.',
'Healthcare sector offers defensive characteristics with growth potential from aging demographics and innovation. Overweight innovative biotechs with strong pipelines while many are trading below historical multiples.',
'https://www.sec.gov/Archives/edgar/data/200406/000020040624000012/jnj-10k_20231231.htm',
'public',
'{"sources": [{"url": "https://www.sec.gov/Archives/edgar/data/200406/000020040624000012/jnj-10k_20231231.htm", "companyName": "Johnson & Johnson", "filingDate": "2024-02-13", "accessionNumber": "0000200406-24-000012", "filingType": "10-K"}]}',
NOW() - INTERVAL '1 hour');

-- Success message
SELECT 'Demo seed data has been successfully created for AI features!' as message; 