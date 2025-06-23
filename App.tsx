import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Firebase
import './firebase';
// Importing Root Component
import RootNavigation from './src/navigation/RootNavigation';
// Styles
import { colors } from './src/styles/theme';
// Utils
import { logError } from './src/utils/logger';

/**
 * Main App component with proper initialization and error handling
 */
const App: React.FC = () => {
  const [isAppReady, setIsAppReady] = useState<boolean>(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Add any app initialization logic here
        // For example: loading fonts, checking permissions, etc.
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate initialization
        setIsAppReady(true);
      } catch (error) {
        logError('App', 'App initialization error', error);
        setIsAppReady(true); // Still show the app even if some initialization fails
      }
    };

    initializeApp();
  }, []);

  if (!isAppReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color={colors.light.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <RootNavigation />
    </SafeAreaProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.light.background,
  },
});
