# PRD: Fathom Research Financial Messenger

## 1. Product overview

### 1.1 Document title and version

- PRD: Fathom Research Financial Messenger
- Version: 1.0

### 1.2 Product summary

Fathom Research is a mobile-first social messaging application designed for the
financial community. It combines the engaging, ephemeral nature of platforms
like Snapchat with powerful, finance-specific tools. The application allows
users—from professional analysts to retail investors and students—to share
timely insights through disappearing photo/video messages and stories.

Key features include real-time chat, a gamified user score to encourage
engagement, and simple AR filters for overlaying stock tickers on content. A
cornerstone of the platform is a Phase 2 feature leveraging a
Retrieval-Augmented Generation (RAG) model, which uses official corporate
filings from EDGAR and OpenAI's language models to help creators generate
accurate, data-driven captions for their posts. The platform aims to provide a
unique space for private financial collaboration and public content creation,
fostering a more informed and connected financial community.

## 2. Goals

### 2.1 Business goals

- Validate the core feature set (ephemeral messaging, stories, finance-specific
  AR) as a viable product for the target audience.
- Establish a user-friendly and highly engaging platform that differentiates
  itself from existing social and financial applications.
- Prove the technical feasibility and user value of the RAG-powered content
  generation feature for future expansion.

### 2.2 User goals

- For Content Creators (like Johnny): To have a dedicated platform to share
  timely financial analysis, build an engaged network, and leverage AI tools to
  create accurate content more efficiently.
- For Content Consumers (like Timmy): To access exclusive, timely insights from
  trusted creators in an engaging and modern format, and to participate in
  real-time financial discussions.

### 2.3 Non-goals

- This project will not include complex financial tools such as portfolio
  tracking, trading execution, or advanced charting.
- The application will not function as a brokerage or provide official financial
  advice.
- A desktop or web-based version of the application is not in scope for the
  initial phases.

## 3. User personas

### 3.1 Key user types

- Financial Content Creators
- Retail Investors
- Professional Financial Analysts
- Finance Students

### 3.2 Basic persona details

- **Johnny (The Creator)**: A savvy retail investor who actively shares his
  market analysis and trade ideas on social media. He wants to build a trusted
  community and needs tools to create unique, data-rich content that stands out.
- **Timmy (The Consumer)**: A university student majoring in finance. He follows
  several popular analysts to supplement his learning and wants a quick,
  digestible way to understand market movements and company performance.

### 3.3 Role-based access

- **Registered User**: Has full access to all application features, including
  creating content, sending messages, managing friends, viewing stories, and
  using the AI caption generator. All users post-registration fall into this
  single role.
- **Guest**: An unauthenticated individual who can only view the application's
  login and sign-up screens. They cannot view or create any content.

## 4. Functional requirements

- **Disappearing Messages** (Priority: High)
  - Users can send photo and video messages to individual friends.
  - Messages expire and are deleted 24 hours after being viewed.
  - Users receive notifications for new messages.
- **Stories** (Priority: High)
  - Users can post photo and video stories that are viewable for 24 hours.
  - Stories can be set to "Public" (viewable by anyone who views the profile) or
    "Private" (viewable by friends only).
  - A user-level setting determines the default privacy for new stories.
- **Real-Time Chat** (Priority: High)
  - A dedicated interface for text-based chat with friends.
  - Supports real-time message delivery and read receipts.
- **Friend Management** (Priority: High)
  - Users can search for other users by username and send friend requests.
  - Users can accept or decline incoming friend requests.
  - Users can block or remove existing friends.
  - A feature to suggest random active users to follow.
- **AR Free-Text Filter** (Priority: Medium)
  - While recording a video or taking a photo, users can apply a simple text
    overlay.
  - The feature provides a free-text input field for the user to type any
    desired text (e.g., "AAPL +2%", "My thoughts on $TSLA").
- **User Score** (Priority: Medium)
  - Users gain points for engagement: +10 points per Story posted, +5 per
    message sent.
  - The total score is displayed on the user's profile page.
- **AI-Generated Captions (RAG)** (Priority: High - Phase 2)
  - Users can request AI-generated captions for their posts.
  - The AI uses context from EDGAR filings (e.g., 10-Qs, 10-Ks) and OpenAI's
    model.
  - The UI presents 3 caption options for the user to choose from.
  - User's choice and feedback are saved to improve future suggestions.

## 5. Tasks

### 5.1 Phase 1 Tasks (Core Social Messenger)

1.  **Project & Auth Foundation**:
    - Initialize React Native (Expo) project and setup basic file structure.
    - Implement Supabase Authentication (email/password), including sign-up,
      login, and the 18+ confirmation checkbox.
    - Set up basic navigation shell (Auth Stack and Main App Stack).
2.  **User Profiles & Friend Management**:
    - Create Postgres schema for user profiles (username, score, etc.).
    - Build the user profile UI.
    - Implement friend request logic (send, accept, decline), search by
      username, and friend list display.
    - Implement block/remove friend functionality.
    - Implement the "suggest random active users" feature.
3.  **Real-Time Chat**:
    - Set up Supabase Realtime for chat messages.
    - Build the chat list screen and the individual chat conversation UI.
    - Implement real-time message sending and receiving.
4.  **Camera & AR Filter**:
    - Integrate `react-native-vision-camera` for a high-performance camera
      interface.
    - Implement photo and video capture functionality.
    - Build the UI for the free-text AR filter overlay, allowing users to input
      and position text on their media.
5.  **Core Content Features**:
    - Implement the logic for sending disappearing photo/video messages to
      friends.
    - Implement the backend logic (Postgres metadata) and frontend UI for public
      and private Stories.
    - Set up Supabase Edge Functions and TTL policies to handle the 24-hour
      expiration of all content.
6.  **Scoring & Finalization**:
    - Implement the User Score logic in Postgres, triggered by sending messages
      and posting stories.
    - Implement basic push notifications for new messages and friend requests
      using Supabase.
    - Polish the overall UI/UX, focusing on the main navigation flow between
      camera, chat, and stories.

### 5.2 Phase 2 Tasks (RAG-Enhanced Content Creation)

1.  **RAG Backend Setup**:
    - Perform a one-time data scrape and import of relevant EDGAR filings using
      `edgartools`.
    - Set up a Vector Database (e.g., using OpenAI's embeddings API and a
      compatible vector store) and create embeddings for the EDGAR data.
    - Index the embeddings for efficient querying.
2.  **AI Cloud Function**:
    - Develop and deploy a Supabase Edge Function that serves as the RAG
      endpoint.
    - The function will take a user query (e.g., "Tesla 10-Q"), retrieve
      relevant text chunks from the Vector DB, and pass them as context to the
      OpenAI (Llama 3 equivalent) model.
    - The function will return the AI-generated text.
3.  **Frontend RAG Integration**:
    - Build the UI for the AI-powered chat interface that allows users to query
      the RAG model to generate content ideas.
    - Integrate the RAG feature into the post-creation flow.
    - Build the UI to present the three generated caption options to the user.
    - Implement the feedback mechanism to log the user's caption choice to
      Postgres for future personalization.

## 6. User experience

### 6.1. Entry points & first-time user flow

- Users download the app from the iOS App Store.
- First-time users are prompted to sign up using an email and password.
- During sign-up, users must agree to a simple checkbox confirming they are 18
  years or older.
- After successful registration, a brief onboarding carousel highlights key
  features (ephemeral messages, stories, user score).
- The user lands on the main camera screen, ready to create content.

### 6.2. Core experience

- **Create**: The user experience starts with the camera. The user can capture a
  photo or video, apply a free-text AR filter, and then choose to send it as a
  direct message or post it to their Story (with a public/private toggle).
- **Consume**: Users can navigate from the camera screen to their chat list, the
  stories feed, and an explore page featuring popular public content.
- **Interact**: Users can reply to stories directly (which initiates a chat),
  engage in text conversations, and view friends' profiles to see their user
  score.

### 6.3. Advanced features & edge cases

- Advanced features include using the RAG-powered chat to get content ideas and
  generate captions, and managing a blocklist.
- Edge cases include: handling network interruptions during media uploads,
  displaying an empty state screen when a new user has no friends or stories to
  view, and providing clear error messages if a user tries to access expired
  content.

### 6.4. UI/UX highlights

- The ephemeral nature of content creates a sense of urgency and encourages
  daily check-ins.
- The gamified user score provides a simple and visible metric for engagement,
  motivating users to contribute content.
- Interactive AR filters make dense financial information more accessible and
  shareable.
- A clean, modern UI inspired by leading social apps ensures the experience is
  intuitive and user-friendly.

## 7. Narrative

Johnny is a financial analyst who wants to share his insights on a recent tech
company's earnings report, but he's tired of the noise and impersonal nature of
large social networks. He discovers SnapConnect and is immediately drawn to its
focused, ephemeral format. He snaps a video of his analysis, types "NVDA +8%" as
a custom AR filter, and sends it to his private Story for his trusted circle of
friends to see. Later, he uses the AI caption generator to create a data-rich
public post about Apple's 10-Q filing, saving him time and ensuring accuracy.
The platform allows him to engage his network meaningfully and see his influence
grow through his User Score, all in one seamless experience.

## 8. Success metrics

### 8.1. User-centric metrics

- Daily Active Users (DAU) and Monthly Active Users (MAU).
- Average number of messages and stories sent per user per day.
- Friend requests sent and accepted per user session.
- Ratio of content creators to content consumers.

### 8.2. Business metrics

- User Retention Rate: Percentage of users returning on Day 1, Day 7, and
  Day 30.
- Feature Adoption: Percentage of active users who use the AR filters and the
  RAG caption generator.
- Virality: Average number of invites or new users generated per existing user.

### 8.3. Technical metrics

- Application crash rate and ANR (Application Not Responding) rate.
- Median latency for message delivery and media uploads.
- API uptime and server response times for all Supabase services.

## 9. Technical considerations

### 9.1. Integration points

- **Supabase**: For Authentication, Postgres, Realtime, Storage, and Edge
  Functions.
- **OpenAI**: For embeddings and the language model used in the RAG pipeline.
- **Vector Database**: A vector database solution (e.g., Pinecone, Weaviate)
  will be required to store and query embeddings from EDGAR documents for the
  RAG feature.
- **edgartools**: Utilized for an initial one-time import of corporate filings
  data into the vector index.

### 9.2. Data storage & privacy

- User profiles, friend graphs, scores, and post metadata will be stored in
  Postgres.
- Photos and videos will be stored in Supabase Storage.
- Real-time chat messages will be handled by Supabase Realtime.
- All user-generated content (messages and stories) will have a 24-hour
  Time-to-Live (TTL) and must be deleted after expiration. This will be managed
  via backend logic (e.g., Edge Functions with a cron job).
- Direct messages are strictly private between users. Story privacy is
  controlled by the user at the post level.

### 9.3. Scalability & performance

- Supabase services are designed for high scalability. Postgres queries must be
  structured efficiently to minimize cost and latency.
- Media uploads should be optimized for mobile networks, possibly with
  client-side compression before upload.
- The RAG feature is the most significant performance consideration; the Edge
  Function must be optimized for fast response times to ensure a good user
  experience.

### 9.4. Potential challenges

- The development timeline is extremely aggressive and presents a significant
  risk.
- The one-man team size requires efficient and focused development.
- The RAG pipeline integration in Phase 2 is technically complex and a potential
  bottleneck.
- Ensuring a smooth, bug-free camera and AR experience across a variety of iOS
  devices.

## 10. Milestones & sequencing

### 10.1. Project estimate

- Extremely Aggressive: The entire project is planned as two consecutive,
  high-intensity sprints.

### 10.2. Team size & composition

- Small Team: 1 Engineer, 1 AI Product Manager.

### 10.3. Suggested phases

- **Phase 1: Core Social Messenger** (Target: June 24)
  - Key deliverables: User authentication, real-time chat, disappearing
    photo/video messages, public/private stories, friend management, user score
    system, and a free-text AR filter.
- **Phase 2: RAG-Enhanced Content Creation** (Target: June 25-29)
  - Key deliverables: Integration of the RAG pipeline using EDGAR data and
    OpenAI, an AI-powered chat interface for content ideas, and a UI for
    selecting AI-generated captions.

## 11. User stories

### 11.1. Send a disappearing photo message

- **ID**: US-001
- **Description**: As Johnny (a Creator), I want to send a photo of a private
  market analysis chart to a specific friend, so that I can share a timely
  insight that disappears after it has been viewed.
- **Acceptance criteria**:
  - User can select a friend from their friend list.
  - User can take a photo from the camera interface.
  - The photo can be sent to the selected friend.
  - The recipient receives a notification for the new message.
  - Once the recipient opens the message, a 24-hour expiration timer starts.
  - The message is no longer accessible to either user after 24 hours.

### 11.2. Post a private, friend-only story

- **ID**: US-002
- **Description**: As Johnny (a Creator), I want to post a short video
  explaining a market trend to my Story, but make it visible only to my accepted
  friends, so I can share exclusive content with my inner circle.
- **Acceptance criteria**:
  - User can record a video from the camera interface.
  - User has an option to toggle the Story's privacy between "Public" and
    "Private (Friends Only)".
  - When posted as "Private," the Story appears in the Stories feed of only the
    user's friends.
  - The Story automatically expires and becomes inaccessible to everyone after
    24 hours.

### 11.3. View content and check user score

- **ID**: US-003
- **Description**: As Timmy (a Consumer), I want to watch my favorite creator's
  public Story and then visit their profile to see how their User Score has
  changed, so I can feel engaged with their content and community.
- **Acceptance criteria**:
  - User can view public Stories from any user.
  - From a Story or user search, a user can navigate to another user's profile
    page.
  - The profile page prominently displays the user's total score.
  - The score updates in near real-time as the user posts new content.

### 11.4. Securely access the application

- **ID**: US-004
- **Description**: As a user, I want to sign up and log in with an email and
  password, so that I can securely access my account and private content.
- **Acceptance criteria**:
  - A new user can create an account using a valid email and a password of at
    least 6 characters.
  - During sign-up, the user must check a box to confirm they are 18 years or
    older.
  - An existing user can log in with their registered email and password.
  - The app displays clear error messages for incorrect login credentials or
    other authentication issues.
  - A user's session is securely maintained after a successful login.

### 11.5. Apply AR free-text filter to a video

- **ID**: US-005
- **Description**: As Johnny (a Creator), I want to type a custom "GOOG -3%"
  text overlay onto a video I'm recording about their recent product launch, so
  I can visually contextualize my analysis.
- **Acceptance criteria**:
  - From the camera screen, the user can activate a text input mode.
  - The UI presents a text field where the user can type their desired content.
  - The user-entered text is rendered as an overlay on top of the camera view in
    real-time.
  - The user can adjust the position and size of the text overlay.
  - The recorded video includes the custom text overlay.

### 11.6. Generate AI-powered caption for a post

- **ID**: US-006
- **Description**: As Johnny (a Creator), I want to generate a caption for my
  Story about Tesla's latest 10-Q filing, so I can quickly create an accurate
  and engaging post without having to manually look up the exact figures.
- **Acceptance criteria**:
  - User can initiate a request for an AI-generated caption from the post
    creation screen.
  - User can provide context, such as a company name or filing type (e.g.,
    "Tesla 10-Q").
  - The system uses this context to query the RAG index and generate relevant
    text.
  - The UI presents the user with three distinct caption options.
  - The user can select one of the options to use as their post's caption.
  - The user's selection is logged for future personalization.
  - The link to the source EDGAR filing is included in the post for
    transparency.
