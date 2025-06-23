import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../../styles/theme';

import { styles } from './styles';

const MapScreen: React.FC = () => {
  const theme = useTheme();
  const dynamicStyles = styles(theme);

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <View style={dynamicStyles.content}>
        <Text style={dynamicStyles.title}>Map Screen</Text>
        <Text style={dynamicStyles.subtitle}>Map functionality coming soon!</Text>
      </View>
    </SafeAreaView>
  );
};

export default MapScreen;
