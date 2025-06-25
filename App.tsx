import React from 'react';
import { LogBox, Text, View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useTheme } from './src/styles/theme';
import { logger, logWithContext } from './src/utils/logger';

logWithContext('App', 'Starting app initialization...');

// Importing Root Component
import RootNavigation from './src/navigation/RootNavigation';

// Suppress known harmless warnings
LogBox.ignoreLogs([
  'Sending `onAnimatedValueUpdate` with no listeners registered.',
  'Warning: Each child in a list should have a unique "key" prop.',
]);

logger.info('App started');
logWithContext('App', 'Logger initialized');

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorMessage: {
    textAlign: 'center',
    marginBottom: 20,
  },
  errorDetails: {
    fontSize: 12,
    textAlign: 'center',
  },
});

const ErrorDisplay: React.FC<{ error?: Error }> = ({ error }) => {
  const theme = useTheme();
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorTitle}>Something went wrong!</Text>
      <Text style={styles.errorMessage}>{error?.message ?? 'Unknown error occurred'}</Text>
      <Text style={[styles.errorDetails, { color: theme.colors.textSecondary }]}>
        Check the console for more details
      </Text>
    </View>
  );
};

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    logWithContext('App', 'Error boundary caught error', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logWithContext('App', 'Error boundary details', { error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorDisplay error={this.state.error} />;
    }

    return this.props.children;
  }
}

const App: React.FC = () => {
  logWithContext('App', 'Rendering main app component');

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <RootNavigation />
      </SafeAreaProvider>
    </ErrorBoundary>
  );
};

logWithContext('App', 'App component defined');

export default App;
