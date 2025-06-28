import React from 'react';
import { View, Text, TextInput, TextInputProps, TouchableOpacity } from 'react-native';

import { useTheme } from '../../styles/theme';
import Icon from '../Icon';

import { styles } from './styles';

interface FormFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  disabled?: boolean;
  variant?: 'default' | 'chat' | 'inline' | 'search';
  size?: 'small' | 'medium' | 'large';
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  showLabel?: boolean;
  containerStyle?: object;
  inputStyle?: object;
}

/**
 * Enhanced form field component with multiple variants and styling options
 * Supports standard forms, chat inputs, inline editing, and search fields
 *
 * @param label - Text label displayed above input (optional)
 * @param error - Error message to display below input
 * @param disabled - Whether the input is disabled
 * @param variant - Style variant: 'default', 'chat', 'inline', 'search'
 * @param size - Size variant: 'small', 'medium', 'large'
 * @param leftIcon - Icon name to show on left side
 * @param rightIcon - Icon name to show on right side
 * @param onRightIconPress - Callback for right icon press
 * @param showLabel - Whether to show the label (default: true if label provided)
 * @param containerStyle - Additional container styling
 * @param inputStyle - Additional input styling
 */
const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  disabled = false,
  variant = 'default',
  size = 'medium',
  leftIcon,
  rightIcon,
  onRightIconPress,
  showLabel = true,
  containerStyle,
  inputStyle,
  ...textInputProps
}) => {
  const theme = useTheme();
  const dynamicStyles = styles(theme);

  const getVariantStyles = () => {
    switch (variant) {
      case 'chat':
        return {
          container: dynamicStyles.chatContainer,
          input: dynamicStyles.chatInput,
        };
      case 'inline':
        return {
          container: dynamicStyles.inlineContainer,
          input: dynamicStyles.inlineInput,
        };
      case 'search':
        return {
          container: dynamicStyles.searchContainer,
          input: dynamicStyles.searchInput,
        };
      default:
        return {
          container: dynamicStyles.container,
          input: dynamicStyles.input,
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return dynamicStyles.sizeSmall;
      case 'large':
        return dynamicStyles.sizeLarge;
      default:
        return dynamicStyles.sizeMedium;
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  const renderInput = () => (
    <View style={[dynamicStyles.inputWrapper, variantStyles.container]}>
      {/* 3D Glossy Overlay Effects - skip for inline variant */}
      {variant !== 'inline' && (
        <>
          <View style={dynamicStyles.inputGloss} />
          <View style={dynamicStyles.inputShadow} />
        </>
      )}

      {leftIcon && (
        <View style={dynamicStyles.leftIconContainer}>
          <Icon
            name={leftIcon}
            size={size === 'small' ? 16 : size === 'large' ? 24 : 20}
            color={theme.colors.textSecondary}
          />
        </View>
      )}

      <TextInput
        style={[
          variantStyles.input,
          sizeStyles,
          error ? dynamicStyles.inputError : undefined,
          disabled ? dynamicStyles.inputDisabled : undefined,
          leftIcon ? dynamicStyles.inputWithLeftIcon : undefined,
          rightIcon ? dynamicStyles.inputWithRightIcon : undefined,
          inputStyle,
        ].filter(Boolean)}
        placeholderTextColor={theme.colors.textSecondary}
        editable={!disabled}
        {...textInputProps}
      />

      {rightIcon && (
        <TouchableOpacity
          style={dynamicStyles.rightIconContainer}
          onPress={onRightIconPress}
          disabled={!onRightIconPress}
        >
          <Icon
            name={rightIcon}
            size={size === 'small' ? 16 : size === 'large' ? 24 : 20}
            color={onRightIconPress ? theme.colors.primary : theme.colors.textSecondary}
          />
        </TouchableOpacity>
      )}
    </View>
  );

  // For inline variant, don't show label or error
  if (variant === 'inline') {
    return <View style={[containerStyle]}>{renderInput()}</View>;
  }

  return (
    <View style={[dynamicStyles.fieldContainer, containerStyle]}>
      {label && showLabel && (
        <Text
          style={[dynamicStyles.label, variant === 'chat' ? dynamicStyles.chatLabel : undefined]}
        >
          {label}
        </Text>
      )}

      {renderInput()}

      {error && <Text style={dynamicStyles.errorText}>{error}</Text>}
    </View>
  );
};

export default FormField;
