/**
 * HomeScreen Constants
 *
 * Contains all static data and configuration for the HomeScreen component.
 * This includes auto-scrolling content, animation timings, and other reusable values.
 */

export interface AutoScrollItem {
  iconName: string;
  text: string;
}

/**
 * Auto-scrolling feature content that cycles through different app capabilities
 * Each item displays for 4 seconds with fade transitions
 */
export const AUTO_SCROLL_CONTENT: AutoScrollItem[] = [
  {
    iconName: 'cpu',
    text: 'AI-Powered Analysis - Get intelligent insights from corporate filings and market data',
  },
  {
    iconName: 'users',
    text: 'Creator Network - Connect with top financial analysts and content creators',
  },
  {
    iconName: 'camera',
    text: 'Visual Storytelling - Share market insights through engaging photo and video content',
  },
  {
    iconName: 'message-square',
    text: 'Real-Time Messaging - Chat instantly with your network about breaking market news',
  },
  {
    iconName: 'clock',
    text: 'Ephemeral Content - Financial insights that disappear in 24 hours for timely relevance',
  },
  {
    iconName: 'star',
    text: 'Engagement Scoring - Build your reputation with our gamified user scoring system',
  },
  {
    iconName: 'trending-up',
    text: 'Market Insights - Access curated analysis from SEC filings and earnings reports',
  },
  {
    iconName: 'activity',
    text: 'Trending Analysis - Discover what financial topics are gaining momentum right now',
  },
  {
    iconName: 'award',
    text: 'Premium Features - Advanced tools for serious investors and content creators',
  },
  {
    iconName: 'zap',
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
