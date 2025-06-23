import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

import { useTheme } from '../../styles/theme';

import { styles } from './styles';

interface DisclaimerTextProps {
  onPrivacyPress?: () => void;
  onTermsPress?: () => void;
}

/**
 * Reusable disclaimer text component for terms and privacy policy
 * Used in authentication screens to display legal text
 */
const DisclaimerText: React.FC<DisclaimerTextProps> = ({ onPrivacyPress, onTermsPress }) => {
  const theme = useTheme();
  const dynamicStyles = styles(theme);

  return (
    <Text style={dynamicStyles.disclaimerText}>
      By tapping Sign Up & Accept, you acknowledge that you have read the{' '}
      <TouchableOpacity onPress={onPrivacyPress} style={dynamicStyles.linkContainer}>
        <Text style={dynamicStyles.linkText}>Privacy Policy</Text>
      </TouchableOpacity>{' '}
      and agree to the{' '}
      <TouchableOpacity onPress={onTermsPress} style={dynamicStyles.linkContainer}>
        <Text style={dynamicStyles.linkText}>Terms of Service</Text>
      </TouchableOpacity>
      .
    </Text>
  );
};

export default DisclaimerText;
