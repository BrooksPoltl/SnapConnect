import React from 'react';
import { TextStyle } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

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

  // Cast to any to bypass TypeScript compatibility issues with react-native-vector-icons
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const FeatherIcon = Feather as any;

  return <FeatherIcon name={name} size={size} color={iconColor} style={style} />;
};

export default Icon;
