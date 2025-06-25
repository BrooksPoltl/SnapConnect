import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../styles/theme';
import { UserStackParamList } from '../../types/navigation';

import { styles } from './styles';

const StoriesScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<UserStackParamList>>();
  const theme = useTheme();
  const dynamicStyles = styles(theme);

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <View style={dynamicStyles.header}>
        <Text style={dynamicStyles.headerTitle}>Stories</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Friends')}
          style={dynamicStyles.friendsButton}
        >
          <Ionicons name='people-outline' size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
      <View style={dynamicStyles.content}>
        <Text style={dynamicStyles.title}>Stories Screen</Text>
        <Text style={dynamicStyles.subtitle}>Stories functionality coming soon!</Text>
      </View>
    </SafeAreaView>
  );
};

export default StoriesScreen;
