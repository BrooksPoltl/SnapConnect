/**
 * SourceCitation Component
 * Displays a single source citation with company name, filing type, and date
 * Entire component is clickable to open the source URL
 */

import React from 'react';
import { View, Text, TouchableOpacity, Linking, ViewStyle } from 'react-native';
import Icon from '../Icon';
import { useTheme } from '../../styles/theme';
import { logger } from '../../utils/logger';
import { styles } from './styles';
import type { Source } from '../../types';

interface SourceCitationProps {
  source: Source;
  style?: ViewStyle;
}

const SourceCitation: React.FC<SourceCitationProps> = ({ source, style }) => {
  const theme = useTheme();
  const dynamicStyles = styles(theme);

  const handlePress = async () => {
    if (source.url) {
      try {
        await Linking.openURL(source.url);
      } catch (error) {
        logger.error('Failed to open URL:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <TouchableOpacity
      style={[dynamicStyles.container, style]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={dynamicStyles.content}>
        <View style={dynamicStyles.header}>
          <Text style={dynamicStyles.companyName} numberOfLines={2}>
            {source.companyName} 2024 {source.filingType}
          </Text>
          <Icon name='external-link' size={16} color={theme.colors.textSecondary} />
        </View>
        {source.filingDate && (
          <Text style={dynamicStyles.filingDate}>{formatDate(source.filingDate)}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default SourceCitation;
