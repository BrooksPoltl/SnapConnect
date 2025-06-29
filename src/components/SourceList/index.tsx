/**
 * SourceList Component
 * Displays a list of sources in an expandable section
 * Toggle button to show/hide sources
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import Icon from '../Icon';
import SourceCitation from '../SourceCitation';
import { useTheme } from '../../styles/theme';
import { styles } from './styles';
import type { Source } from '../../types';

interface SourceListProps {
  sources: Source[];
  style?: ViewStyle;
}

const SourceList: React.FC<SourceListProps> = ({ sources, style }) => {
  const theme = useTheme();
  const dynamicStyles = styles(theme);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!sources || sources.length === 0) {
    return null;
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const sourceCount = sources.length;
  const sourceText = sourceCount === 1 ? 'source' : 'sources';

  return (
    <View style={[dynamicStyles.container, style]}>
      <TouchableOpacity
        style={dynamicStyles.toggleButton}
        onPress={toggleExpanded}
        activeOpacity={0.7}
      >
        <View style={dynamicStyles.toggleContent}>
          <Icon name='file-text' size={16} color={theme.colors.textSecondary} />
          <Text style={dynamicStyles.toggleText}>
            {isExpanded ? 'Hide sources' : `View ${sourceCount} ${sourceText}`}
          </Text>
          <Icon
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={theme.colors.textSecondary}
          />
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View style={dynamicStyles.sourcesList}>
          {sources.map((source, index) => (
            <SourceCitation key={source.accessionNumber || index} source={source} />
          ))}
        </View>
      )}
    </View>
  );
};

export default SourceList;
