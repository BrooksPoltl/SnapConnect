import React from 'react';
import { Text, TextStyle } from 'react-native';

import { useTheme } from '../../styles/theme';
import { ThemeColor } from '../../types/theme';

interface IconProps {
  name: string;
  size?: number;
  color?: ThemeColor | string;
  style?: TextStyle;
}

/**
 * A theme-aware icon component using Feather Icons
 * @param name - The name of the Feather icon
 * @param size - The size of the icon (default: 24)
 * @param color - Theme color key or custom color string (default: 'text')
 * @param style - Additional styles to apply
 */
const Icon: React.FC<IconProps> = ({ name, size = 24, color = 'text', style }) => {
  const { colors } = useTheme();

  // Use theme color if it exists, otherwise use the provided color string
  const getIconColor = (colorKey: string): string => {
    if (colorKey in colors) {
      return colors[colorKey as keyof typeof colors];
    }
    return colorKey;
  };

  const iconColor = getIconColor(color);

  // For now, we'll use a simple text representation
  // This will be replaced with proper Feather icons once the library issue is resolved
  const getIconSymbol = (iconName: string): string => {
    const iconMap: Record<string, string> = {
      image: '🖼️',
      'refresh-cw': '🔄',
      'refresh-ccw': '↻',
      'arrow-left': '←',
      download: '⬇️',
      send: '➤',
      'trash-2': '🗑️',
      zap: '⚡',
      'zap-off': '🔦',
      video: '🎥',
      music: '🎵',
      moon: '🌙',
      'trending-up': '📈',
      'message-square': '💬',
      camera: '📷',
      users: '👥',
      'play-circle': '▶️',
      square: '☐',
      'check-square': '☑️',
    };
    return iconMap[iconName] ?? '?';
  };

  return <Text style={[{ fontSize: size, color: iconColor }, style]}>{getIconSymbol(name)}</Text>;
};

export default Icon;
