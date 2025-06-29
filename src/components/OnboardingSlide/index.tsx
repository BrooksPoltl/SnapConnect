/**
 * OnboardingSlide Component
 *
 * A reusable slide component for the onboarding flow that displays:
 * - A title and descriptive text
 * - A scaled-down snapshot of a relevant app screen
 * - Consistent styling across all onboarding steps
 */
import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles';

interface OnboardingSlideProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

/**
 * Individual slide component for the onboarding flow
 * @param title - The slide's main title
 * @param description - Descriptive text explaining the feature
 * @param children - Optional component snapshot to display
 */
export const OnboardingSlide: React.FC<OnboardingSlideProps> = ({
  title,
  description,
  children,
}) => (
  <View style={styles.container}>
    <View style={styles.content}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>

    {children && <View style={styles.snapshotContainer}>{children}</View>}
  </View>
);
