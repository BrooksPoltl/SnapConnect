import React from 'react';
import { LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Firebase
import './firebase';
// Importing Root Component
import RootNavigation from './src/navigation/RootNavigation';
// Utils
import { logger } from './src/utils/logger';

// Suppress Firebase logger messages on the UI
LogBox.ignoreLogs([
  '[@firebase/auth]',
  '[@firebase/firestore]',
  '[@firebase/app]',
  'FirebaseError',
]);

// Suppress known harmless warnings
LogBox.ignoreLogs([
  'Sending `onAnimatedValueUpdate` with no listeners registered.',
  'Warning: Each child in a list should have a unique "key" prop.',
]);

logger.info('App started');

const App: React.FC = () => (
  <SafeAreaProvider>
    <RootNavigation />
  </SafeAreaProvider>
);

export default App;
