import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';

import { useTheme } from '../../styles/theme';

import { styles } from './styles';

interface FormFieldProps extends TextInputProps {
  label: string;
  error?: string;
  disabled?: boolean;
}

/**
 * Reusable form field component with label and error display
 * Used across authentication screens for consistent styling
 */
const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  disabled = false,
  ...textInputProps
}) => {
  const theme = useTheme();
  const dynamicStyles = styles(theme);

  return (
    <View style={dynamicStyles.container}>
      <Text style={dynamicStyles.label}>{label}</Text>
      <TextInput
        style={[
          dynamicStyles.input,
          error ? dynamicStyles.inputError : undefined,
          disabled ? dynamicStyles.inputDisabled : undefined,
        ].filter(Boolean)}
        placeholderTextColor={theme.colors.textSecondary}
        editable={!disabled}
        {...textInputProps}
      />
      {error && <Text style={dynamicStyles.errorText}>{error}</Text>}
    </View>
  );
};

export default FormField;
