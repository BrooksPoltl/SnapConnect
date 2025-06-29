/**
 * OnboardingScreen Component
 *
 * A comprehensive onboarding flow that introduces new users to Fathom Research's
 * core features through interactive slides. Features:
 * - 5 slides explaining AI insights, sharing, networking, and stories
 * - Progress indicator and navigation controls
 * - Skip option and completion tracking
 * - Scaled-down component snapshots for visual demonstration
 */
import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OnboardingSlide, OnboardingSnapshot } from '../../components';
import { markOnboardingComplete } from '../../services/user';
import { logger } from '../../utils/logger';
import { styles } from './styles';

interface OnboardingScreenProps {
  onComplete: () => void;
}

const { width: screenWidth } = Dimensions.get('window');

const SLIDES = [
  {
    title: 'Welcome to Fathom Research',
    description:
      "For too long, professional-grade research has been locked away. Fathom gives you the power to break down those walls. We're democratizing investment research, giving you the tools to go deeper than headlines and make smarter, more informed decisions.",
    snapshotType: 'welcome' as const,
  },
  {
    title: 'From 100 Pages to 3 Sentences',
    description:
      'Our AI reads dense SEC filings like 10-Ks and 10-Qs for you. Ask a complex question and get the core insights in seconds, not hours.',
    snapshotType: 'ai-insights' as const,
  },
  {
    title: 'Share Verifiable Insights',
    description:
      'When you share an AI-generated insight, it automatically includes a link to the source document. Elevate your conversations with data that anyone can verify.',
    snapshotType: 'sharing' as const,
  },
  {
    title: 'Build Your Research Network',
    description:
      'Create focused groups to discuss strategies or follow public conversations to see what others are uncovering. This is where the best minds connect.',
    snapshotType: 'networking' as const,
  },
  {
    title: 'The Story Behind the Stock',
    description:
      "Share your analysis and discoveries through ephemeral photo and video stories. It's not just about what you trade; it's about what you know.",
    snapshotType: 'stories' as const,
  },
];

/**
 * Main onboarding screen that guides new users through app features
 * @param onComplete - Callback function called when onboarding is completed
 */
export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  /**
   * Handles navigation to the next slide or completion
   */
  const handleNext = async () => {
    if (currentSlide < SLIDES.length - 1) {
      const nextSlide = currentSlide + 1;
      setCurrentSlide(nextSlide);
      scrollViewRef.current?.scrollTo({ x: nextSlide * screenWidth, animated: true });
    } else {
      await handleComplete();
    }
  };

  /**
   * Handles navigation to the previous slide
   */
  const handlePrevious = () => {
    if (currentSlide > 0) {
      const prevSlide = currentSlide - 1;
      setCurrentSlide(prevSlide);
      scrollViewRef.current?.scrollTo({ x: prevSlide * screenWidth, animated: true });
    }
  };

  /**
   * Handles skipping the onboarding flow
   */
  const handleSkip = async () => {
    await handleComplete();
  };

  /**
   * Marks onboarding as complete and calls the completion callback
   */
  const handleComplete = async () => {
    try {
      setIsCompleting(true);
      logger.info('OnboardingScreen', 'Completing onboarding flow');

      await markOnboardingComplete();
      onComplete();
    } catch (error) {
      logger.error('OnboardingScreen', 'Error completing onboarding', error);
      // Still call onComplete to avoid blocking the user
      onComplete();
    } finally {
      setIsCompleting(false);
    }
  };

  /**
   * Handles scroll events to update current slide
   */
  const handleScroll = (event: { nativeEvent: { contentOffset: { x: number } } }) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
    if (slideIndex !== currentSlide) {
      setCurrentSlide(slideIndex);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Skip button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Progress indicator */}
      <View style={styles.progressContainer}>
        {SLIDES.map((_, index) => (
          <View
            key={index}
            style={[styles.progressDot, index === currentSlide && styles.progressDotActive]}
          />
        ))}
      </View>

      {/* Slides */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {SLIDES.map((slide, index) => (
          <View key={index} style={[styles.slideContainer, { width: screenWidth }]}>
            <OnboardingSlide title={slide.title} description={slide.description}>
              <OnboardingSnapshot type={slide.snapshotType} />
            </OnboardingSlide>
          </View>
        ))}
      </ScrollView>

      {/* Navigation controls */}
      <View style={styles.navigationContainer}>
        {currentSlide > 0 && (
          <TouchableOpacity onPress={handlePrevious} style={styles.backButton}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}

        <View style={styles.spacer} />

        <TouchableOpacity onPress={handleNext} style={styles.nextButton} disabled={isCompleting}>
          <Text style={styles.nextButtonText}>
            {currentSlide === SLIDES.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
