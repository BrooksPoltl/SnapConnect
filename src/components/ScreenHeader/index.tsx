/**
 * ScreenHeader Component
 * Unified header component for consistent styling across all screens
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../styles/theme';
import Icon from '../Icon';
import { styles } from './styles';

interface ScreenHeaderProps {
  title: string;
  // Layout options
  showBackButton?: boolean;
  showRightAction?: boolean;

  // Customization
  rightActionIcon?: string;
  rightActionText?: string;
  rightActionColor?: string;

  // Callbacks
  onBackPress?: () => void;
  onRightActionPress?: () => void;

  // Special cases
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  centerElement?: React.ReactNode;

  // Styling
  containerStyle?: object;
  titleStyle?: object;
}

/**
 * Unified screen header component following AI Home Screen design standards
 * @param title - The title to display
 * @param showBackButton - Whether to show back button on the left
 * @param showRightAction - Whether to show right action button
 * @param rightActionIcon - Icon name for right action button
 * @param rightActionText - Text for right action button
 * @param rightActionColor - Color for right action button
 * @param onBackPress - Callback for back button press
 * @param onRightActionPress - Callback for right action press
 * @param leftElement - Custom left element (overrides back button)
 * @param rightElement - Custom right element (overrides right action)
 * @param centerElement - Custom center element (overrides title)
 * @param containerStyle - Additional container styles
 * @param titleStyle - Additional title styles
 */
const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  showBackButton = false,
  showRightAction = false,
  rightActionIcon = 'plus',
  rightActionText,
  rightActionColor,
  onBackPress,
  onRightActionPress,
  leftElement,
  rightElement,
  centerElement,
  containerStyle,
  titleStyle,
}) => {
  const theme = useTheme();
  const dynamicStyles = styles(theme);

  const renderLeftElement = () => {
    if (leftElement) {
      return leftElement;
    }

    if (showBackButton) {
      return (
        <TouchableOpacity
          onPress={onBackPress}
          style={dynamicStyles.backButton}
          testID='screen-header-back-button'
        >
          <Icon
            name='arrow-left'
            size={24}
            color={theme.colors.text}
            enable3D={true}
            shadowColor='rgba(0, 0, 0, 0.5)'
          />
        </TouchableOpacity>
      );
    }

    return <View style={dynamicStyles.placeholder} />;
  };

  const renderCenterElement = () => {
    if (centerElement) {
      return centerElement;
    }

    return (
      <Text
        style={[dynamicStyles.title, titleStyle]}
        numberOfLines={1}
        testID='screen-header-title'
      >
        {title}
      </Text>
    );
  };

  const renderRightElement = () => {
    if (rightElement) {
      return rightElement;
    }

    if (showRightAction) {
      return (
        <TouchableOpacity
          style={dynamicStyles.actionButton}
          onPress={onRightActionPress}
          testID='screen-header-action-button'
        >
          {rightActionText ? (
            <Text style={[dynamicStyles.actionButtonText, { color: rightActionColor }]}>
              {rightActionText}
            </Text>
          ) : (
            <Icon
              name={rightActionIcon}
              size={24}
              color={rightActionColor ?? theme.colors.primary}
              backgroundContainer={true}
              containerColor={rightActionColor ?? theme.colors.primary}
              enable3D={true}
              shadowColor={rightActionColor ?? theme.colors.primary}
            />
          )}
        </TouchableOpacity>
      );
    }

    return <View style={dynamicStyles.placeholder} />;
  };

  return (
    <View style={[dynamicStyles.container, containerStyle]}>
      {renderLeftElement()}
      {renderCenterElement()}
      {renderRightElement()}
    </View>
  );
};

export default ScreenHeader;
