import React from 'react';
import { View, ScrollView } from 'react-native';

import { useTheme } from '../../styles/theme';
import SkeletonLoader from '../SkeletonLoader';

import { styles } from './styles';

interface StoryListSkeletonProps {
  count?: number;
}

/**
 * Skeleton loader for story list items
 * Mimics horizontal story list with circular avatars
 *
 * @param count - Number of skeleton items to render (default: 8)
 */
const StoryListSkeleton: React.FC<StoryListSkeletonProps> = ({ count = 8 }) => {
  const theme = useTheme();
  const dynamicStyles = styles(theme);

  const renderSkeletonItem = (index: number) => (
    <View key={index} style={dynamicStyles.storyItem}>
      {/* Story ring skeleton */}
      <View style={dynamicStyles.storyRing}>
        <SkeletonLoader
          width={60}
          height={60}
          borderRadius={30}
          style={dynamicStyles.avatarSkeleton}
        />
      </View>

      {/* Username skeleton */}
      <SkeletonLoader width={45} height={12} style={dynamicStyles.usernameSkeleton} />
    </View>
  );

  return (
    <View style={dynamicStyles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={dynamicStyles.scrollContent}
      >
        {Array.from({ length: count }, (_, index) => renderSkeletonItem(index))}
      </ScrollView>
    </View>
  );
};

export default StoryListSkeleton;
