import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';

interface AvatarProps {
  username: string;
  size?: number;
  isViewed?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({ username, size = 50, isViewed = false }) => {
  const { colors } = useTheme();
  const initial = username ? username.charAt(0).toUpperCase() : '?';

  const dynamicStyles = StyleSheet.create({
    container: {
      width: size,
      height: size,
      borderRadius: size / 2,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.card,
    },
    border: {
      width: size + 6,
      height: size + 6,
      borderRadius: (size + 6) / 2,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: isViewed ? colors.border : colors.primary,
    },
    text: {
      color: colors.text,
      fontSize: size / 2,
      fontWeight: 'bold',
    },
  });

  return (
    <View style={dynamicStyles.border}>
      <View style={dynamicStyles.container}>
        <Text style={dynamicStyles.text}>{initial}</Text>
      </View>
    </View>
  );
};
