/**
 * HomeScreen Constants
 *
 * Contains all static data and configuration for the HomeScreen component.
 * This includes auto-scrolling content, animation timings, and other reusable values.
 */

export interface AutoScrollItem {
  emoji: string;
  text: string;
}

/**
 * Auto-scrolling feature content that cycles through different app capabilities
 * Each item displays for 4 seconds with fade transitions
 */
export const AUTO_SCROLL_CONTENT: AutoScrollItem[] = [
  {
    emoji: '🤖',
    text: 'AI-Powered Analysis - Get intelligent insights from corporate filings and market data',
  },
  {
    emoji: '👥',
    text: 'Creator Network - Connect with top financial analysts and content creators',
  },
  {
    emoji: '📸',
    text: 'Visual Storytelling - Share market insights through engaging photo and video content',
  },
  {
    emoji: '💬',
    text: 'Real-Time Messaging - Chat instantly with your network about breaking market news',
  },
  {
    emoji: '⏰',
    text: 'Ephemeral Content - Financial insights that disappear in 24 hours for timely relevance',
  },
  {
    emoji: '⭐',
    text: 'Engagement Scoring - Build your reputation with our gamified user scoring system',
  },
  {
    emoji: '📊',
    text: 'Market Insights - Access curated analysis from SEC filings and earnings reports',
  },
  {
    emoji: '🔥',
    text: 'Trending Analysis - Discover what financial topics are gaining momentum right now',
  },
  {
    emoji: '💎',
    text: 'Premium Features - Advanced tools for serious investors and content creators',
  },
  {
    emoji: '⚡',
    text: 'Lightning Fast - Real-time updates and instant content sharing for time-sensitive markets',
  },
];

/**
 * Animation timing constants for consistent behavior
 */
export const ANIMATION_TIMINGS = {
  AUTO_SCROLL_INTERVAL: 4000, // 4 seconds
  FADE_DURATION: 500, // 500ms fade transitions
  ENTRANCE_DURATION: 800, // Initial fade in
  TITLE_DURATION: 600,
  TAGLINE_DURATION: 700,
  SUBTITLE_DURATION: 600,
  BUTTON_PRESS_DURATION: 150,
} as const;
