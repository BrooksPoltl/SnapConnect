import React from 'react';
import { TextStyle, View, ViewStyle } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { useTheme } from '../../styles/theme';
import { ThemeColor } from '../../types/theme';

interface IconProps {
  name: string;
  size?: number;
  color?: ThemeColor | string;
  style?: TextStyle;
  // 3D Effect Props
  enable3D?: boolean;
  backgroundContainer?: boolean;
  containerColor?: string;
  containerSize?: number;
  shadowColor?: string;
  shadowOpacity?: number;
}

/**
 * A theme-aware icon component using Feather Icons with optional 3D effects
 * @param name - The name of the Feather icon
 * @param size - The size of the icon (default: 24)
 * @param color - Theme color key or custom color string (default: 'text')
 * @param style - Additional styles to apply
 * @param enable3D - Enable 3D shadow effects
 * @param backgroundContainer - Wrap icon in a background container
 * @param containerColor - Background color for container (default: primary)
 * @param containerSize - Size of background container (default: size * 1.8)
 * @param shadowColor - Custom shadow color
 * @param shadowOpacity - Custom shadow opacity
 */
const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = 'text',
  style,
  enable3D = false,
  backgroundContainer = false,
  containerColor,
  containerSize,
  shadowColor,
  shadowOpacity = 0.4,
}) => {
  const { colors } = useTheme();

  // Use theme color if it exists, otherwise use the provided color string
  const getIconColor = (colorKey: string): string => {
    // Handle special cases for common color references
    if (colorKey === 'background') {
      return colors.background;
    }
    if (colorKey === 'white') {
      return colors.white;
    }

    // Check if it's a valid theme color key
    if (colorKey in colors) {
      return colors[colorKey as keyof typeof colors];
    }

    // Return the color string as-is (for hex colors, etc.)
    return colorKey;
  };

  const iconColor = getIconColor(color);

  // Cast to any to bypass TypeScript compatibility issues with react-native-vector-icons
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const FeatherIcon = Feather as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const MaterialIcon = MaterialIcons as any;

  // Map specific icons to their appropriate icon sets
  const getMaterialIcon = (iconName: string): boolean => {
    const materialIcons = ['lightbulb', 'lightbulb-outline', 'sparkles', 'auto-awesome'];
    return materialIcons.includes(iconName);
  };

  // Container styles for background containers
  const containerStyles: ViewStyle = {
    width: containerSize ?? size * 1.8,
    height: containerSize ?? size * 1.8,
    borderRadius: (containerSize ?? size * 1.8) / 2,
    backgroundColor: containerColor ?? colors.primary,
    justifyContent: 'center',
    alignItems: 'center',

    // 3D Container Effects
    shadowColor: shadowColor ?? colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity,
    shadowRadius: 8,
    elevation: 12,

    // Multi-layer borders for 3D effect
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderTopColor: 'rgba(255, 255, 255, 0.4)',
    borderBottomColor: 'rgba(0, 0, 0, 0.2)',
  };

  // Base icon styles with optional 3D effects
  const iconStyles: TextStyle = {
    ...style,
    ...(enable3D && {
      // Enhanced icon shadow effects
      textShadowColor: shadowColor ?? 'rgba(0, 0, 0, 0.6)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,
    }),
  };

  // Render the appropriate icon based on icon set
  const isMaterialIcon = getMaterialIcon(name);

  const iconElement = isMaterialIcon ? (
    <MaterialIcon
      name={name}
      size={size}
      color={backgroundContainer ? '#FFFFFF' : iconColor}
      style={iconStyles}
    />
  ) : (
    <FeatherIcon
      name={name}
      size={size}
      color={backgroundContainer ? '#FFFFFF' : iconColor}
      style={iconStyles}
    />
  );

  if (backgroundContainer) {
    return <View style={containerStyles}>{iconElement}</View>;
  }

  return iconElement;
};

export default Icon;
