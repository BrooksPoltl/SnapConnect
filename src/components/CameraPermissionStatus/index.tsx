import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../../styles/theme';

import { styles } from './styles';

interface CameraPermissionStatusProps {
  isLoading: boolean;
  hasPermission: boolean | undefined;
}

/**
 * Component that displays camera permission status
 * Shows loading state while requesting permissions
 * Shows error message if permissions are denied
 */
const CameraPermissionStatus: React.FC<CameraPermissionStatusProps> = ({
  isLoading,
  hasPermission,
}) => {
  const theme = useTheme();
  const dynamicStyles = styles(theme);

  if (isLoading) {
    return (
      <SafeAreaView style={dynamicStyles.container}>
        <View style={dynamicStyles.messageContainer}>
          <Text style={dynamicStyles.messageText}>Requesting camera permissions...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!hasPermission) {
    return (
      <SafeAreaView style={dynamicStyles.container}>
        <View style={dynamicStyles.messageContainer}>
          <Text style={dynamicStyles.messageText}>
            Camera permission not granted. Please enable camera access in your device settings.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return null;
};

export default CameraPermissionStatus;
