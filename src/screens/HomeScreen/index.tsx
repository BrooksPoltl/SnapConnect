import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';

import { AuthStackParamList } from '../../types/navigation';
import { useTheme } from '../../styles/theme';
import { Icon, HomeScreenAnimatedText } from '../../components';
import { AUTO_SCROLL_CONTENT, ANIMATION_TIMINGS } from './constants';

import { styles } from './styles';

type HomeScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'AuthHome'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const dynamicStyles = styles(theme);

  // Animation values - memoized to prevent recreation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;
  const taglineAnim = useRef(new Animated.Value(0)).current;
  const subtitleAnim = useRef(new Animated.Value(0)).current;
  const contentFade = useRef(new Animated.Value(1)).current;

  // Auto-scrolling content
  const [currentIndex, setCurrentIndex] = useState(0);

  // Use constants for auto-scroll content
  const autoScrollContent = AUTO_SCROLL_CONTENT;

  // Memoize navigation callbacks
  const onPhoneButtonPress = useCallback(() => {
    navigation.navigate('PhoneAuth');
  }, [navigation]);

  const onSignUpPress = useCallback(() => {
    navigation.navigate('SignUp');
  }, [navigation]);

  const onLoginPress = useCallback(() => {
    navigation.navigate('Login');
  }, [navigation]);

  const createButtonPressAnimation = useCallback(
    (callback: () => void) => () => {
      const scaleAnim = new Animated.Value(1);
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: ANIMATION_TIMINGS.BUTTON_PRESS_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: ANIMATION_TIMINGS.BUTTON_PRESS_DURATION,
          useNativeDriver: true,
        }),
      ]).start();
      callback();
    },
    [],
  );

  useEffect(() => {
    // Initial entrance animations
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: ANIMATION_TIMINGS.ENTRANCE_DURATION,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(titleAnim, {
        toValue: 1,
        duration: ANIMATION_TIMINGS.TITLE_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(taglineAnim, {
        toValue: 1,
        duration: ANIMATION_TIMINGS.TAGLINE_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(subtitleAnim, {
        toValue: 1,
        duration: ANIMATION_TIMINGS.SUBTITLE_DURATION,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-scrolling content animation
    const autoScrollInterval = setInterval(() => {
      // Fade out
      Animated.timing(contentFade, {
        toValue: 0,
        duration: ANIMATION_TIMINGS.FADE_DURATION,
        useNativeDriver: true,
      }).start(() => {
        // Change content
        setCurrentIndex(prevIndex => (prevIndex + 1) % autoScrollContent.length);

        // Fade in
        Animated.timing(contentFade, {
          toValue: 1,
          duration: ANIMATION_TIMINGS.FADE_DURATION,
          useNativeDriver: true,
        }).start();
      });
    }, ANIMATION_TIMINGS.AUTO_SCROLL_INTERVAL);

    return () => clearInterval(autoScrollInterval);
  }, [
    fadeAnim,
    logoScale,
    titleAnim,
    taglineAnim,
    subtitleAnim,
    contentFade,
    autoScrollContent.length,
  ]);

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <View style={dynamicStyles.content}>
        {/* Header Section */}
        <View style={dynamicStyles.headerSection}>
          <Animated.View
            style={[
              dynamicStyles.fixedHeader,
              {
                opacity: fadeAnim,
              },
            ]}
          >
            <Animated.View
              style={[dynamicStyles.logoContainer, { transform: [{ scale: logoScale }] }]}
            >
              <Icon name='trending-up' size={48} color={theme.colors.primary} />
            </Animated.View>

            <HomeScreenAnimatedText animatedValue={titleAnim} style={dynamicStyles.title}>
              SnapConnect
            </HomeScreenAnimatedText>

            <HomeScreenAnimatedText animatedValue={taglineAnim} style={dynamicStyles.tagline}>
              Financial insights that disappear in 24 hours
            </HomeScreenAnimatedText>

            <HomeScreenAnimatedText animatedValue={subtitleAnim} style={dynamicStyles.subtitle}>
              Connect with financial creators and share market insights through ephemeral content
            </HomeScreenAnimatedText>
          </Animated.View>
        </View>

        {/* Auto-scrolling Content - Flexible middle section */}
        <View style={dynamicStyles.middleSection}>
          <View style={dynamicStyles.autoScrollSection}>
            <Animated.View style={[dynamicStyles.contentRow, { opacity: contentFade }]}>
              <Icon
                name={autoScrollContent[currentIndex].iconName}
                size={24}
                color={theme.colors.primary}
                style={dynamicStyles.contentIcon}
              />
              <Text style={dynamicStyles.contentText}>{autoScrollContent[currentIndex].text}</Text>
            </Animated.View>
          </View>
        </View>

        {/* Bottom CTA Section */}
        <View style={dynamicStyles.bottomSection}>
          <Text style={dynamicStyles.ctaText}>Ready to transform your financial content?</Text>
          <Text style={dynamicStyles.ctaSubtext}>
            Join creators sharing market insights through engaging visual stories
          </Text>

          <TouchableOpacity
            style={[dynamicStyles.button, dynamicStyles.primaryButton]}
            onPress={createButtonPressAnimation(onSignUpPress)}
            accessibilityRole='button'
            accessibilityLabel='Sign up with email'
          >
            <Text style={dynamicStyles.primaryButtonText}>Get Started</Text>
            <Icon
              name='arrow-right'
              size={16}
              color={theme.colors.background}
              style={dynamicStyles.buttonIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[dynamicStyles.button, dynamicStyles.secondaryButton]}
            onPress={createButtonPressAnimation(onPhoneButtonPress)}
            accessibilityRole='button'
            accessibilityLabel='Sign in with your phone number'
          >
            <Text style={dynamicStyles.secondaryButtonText}>Sign In with Phone</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onLoginPress}>
            <Text style={dynamicStyles.logInText}>
              Already have an account? <Text style={dynamicStyles.logInLink}>Log In</Text>
            </Text>
          </TouchableOpacity>

          <View style={dynamicStyles.footer}>
            <Text style={dynamicStyles.footerText}>
              Join financial creators sharing market insights
            </Text>
            <Text style={dynamicStyles.disclaimer}>
              18+ only • Educational content • Not financial advice
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
