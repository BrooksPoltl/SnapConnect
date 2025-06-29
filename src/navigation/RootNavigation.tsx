import React, { useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { useAuthentication } from '../utils/hooks/useAuthentication';
import { RootStackParamList } from '../types/navigation';
import { OnboardingScreen } from '../screens/OnboardingScreen';

import AuthStack from './AuthStack';
import UserStack from './UserStack';

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigation: React.FC = () => {
  const { user, userData, loading } = useAuthentication();
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  // Show loading state while authentication is being determined
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' />
      </View>
    );
  }

  // Determine if user needs onboarding
  const needsOnboarding =
    user && userData && !userData.has_completed_onboarding && !onboardingComplete;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          // User is not authenticated - show auth flow
          <Stack.Screen name='Auth' component={AuthStack} />
        ) : needsOnboarding ? (
          // User is authenticated but needs onboarding
          <Stack.Screen name='Onboarding'>
            {() => <OnboardingScreen onComplete={() => setOnboardingComplete(true)} />}
          </Stack.Screen>
        ) : (
          // User is authenticated and has completed onboarding - show main app
          <Stack.Screen name='User' component={UserStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
