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
    text: 'AI Research Assistant - Transform 100-page SEC filings into 3-sentence insights instantly',
  },
  {
    iconName: 'shield',
    text: 'Verifiable Sources - Every AI insight includes direct links to original SEC documents',
  },
  {
    iconName: 'users',
    text: 'Research Network - Build focused groups to discuss strategies and share verified insights',
  },
  {
    iconName: 'file-text',
    text: 'SEC Filing Analysis - Deep dive into 10-Ks, 10-Qs, and earnings reports with AI assistance',
  },
  {
    iconName: 'clock',
    text: 'Ephemeral Stories - Share timely market insights that disappear after 24 hours',
  },
  {
    iconName: 'trending-up',
    text: 'Professional Tools - Access institutional-grade research capabilities as a retail investor',
  },
  {
    iconName: 'message-square',
    text: 'Real-Time Discussions - Chat with fellow investors about breaking market developments',
  },
  {
    iconName: 'search',
    text: 'Deep Research - Ask complex questions about any public company and get data-backed answers',
  },
  {
    iconName: 'award',
    text: 'Fight Institutional Power - Level the playing field with tools previously reserved for Wall Street',
  },
  {
    iconName: 'zap',
    text: 'Instant Analysis - Get immediate insights on earnings, filings, and market-moving events',
  },
];

/**
 * Animation timing constants for consistent behavior
 */
export const ANIMATION_TIMINGS = {
  AUTO_SCROLL_INTERVAL: 6000, // 6 seconds - increased for longer content
  FADE_DURATION: 600, // 600ms fade transitions - slightly slower for readability
  ENTRANCE_DURATION: 800, // Initial fade in
  TITLE_DURATION: 600,
  TAGLINE_DURATION: 700,
  SUBTITLE_DURATION: 600,
  BUTTON_PRESS_DURATION: 150,
} as const;
