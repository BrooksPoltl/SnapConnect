/**
 * CollapsibleText Component
 * Displays text with a collapsible view that truncates to ~1 paragraph
 * Includes fade-out gradient and show more/less functionality
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../styles/theme';
import { styles } from './styles';

interface CollapsibleTextProps {
  children: string;
  maxLength?: number; // Characters to show before truncating (default: ~300 for 1 paragraph)
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const CollapsibleText: React.FC<CollapsibleTextProps> = ({
  children,
  maxLength = 300,
  style,
  textStyle,
}) => {
  const theme = useTheme();
  const dynamicStyles = styles(theme);
  const [isExpanded, setIsExpanded] = useState(false);

  // Don't show collapse functionality if text is short
  const shouldTruncate = children.length > maxLength;
  const displayText =
    shouldTruncate && !isExpanded ? `${children.substring(0, maxLength).trim()}...` : children;

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={[dynamicStyles.container, style]}>
      <View style={dynamicStyles.textContainer}>
        <Text style={[dynamicStyles.text, textStyle]}>{displayText}</Text>
      </View>

      {/* Show more/less button */}
      {shouldTruncate && (
        <TouchableOpacity style={dynamicStyles.toggleButton} onPress={toggleExpanded}>
          <Text style={dynamicStyles.toggleButtonText}>
            {isExpanded ? 'Show less' : 'Show more'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CollapsibleText;
