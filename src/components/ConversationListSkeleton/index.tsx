import React from 'react';
import { View } from 'react-native';

import { useTheme } from '../../styles/theme';
import SkeletonLoader from '../SkeletonLoader';

import { styles } from './styles';

interface ConversationListSkeletonProps {
  count?: number;
}

/**
 * Skeleton loader for conversation list items
 * Mimics the structure of ConversationListItem while loading
 *
 * @param count - Number of skeleton items to render (default: 5)
 */
const ConversationListSkeleton: React.FC<ConversationListSkeletonProps> = ({ count = 5 }) => {
  const theme = useTheme();
  const dynamicStyles = styles(theme);

  const renderSkeletonItem = (index: number) => (
    <View key={index} style={dynamicStyles.skeletonItem}>
      {/* Avatar skeleton */}
      <SkeletonLoader
        width={50}
        height={50}
        borderRadius={25}
        style={dynamicStyles.avatarSkeleton}
      />

      {/* Content skeleton */}
      <View style={dynamicStyles.contentSkeleton}>
        {/* Name skeleton */}
        <SkeletonLoader width='60%' height={16} style={dynamicStyles.nameSkeleton} />

        {/* Message preview skeleton */}
        <SkeletonLoader width='85%' height={14} style={dynamicStyles.messageSkeleton} />
      </View>

      {/* Time/badge skeleton */}
      <View style={dynamicStyles.rightSkeleton}>
        <SkeletonLoader width={40} height={12} style={dynamicStyles.timeSkeleton} />

        {/* Occasional unread badge skeleton */}
        {index % 3 === 0 && (
          <SkeletonLoader
            width={20}
            height={20}
            borderRadius={10}
            style={dynamicStyles.badgeSkeleton}
          />
        )}
      </View>
    </View>
  );

  return (
    <View style={dynamicStyles.container}>
      {Array.from({ length: count }, (_, index) => renderSkeletonItem(index))}
    </View>
  );
};

export default ConversationListSkeleton;
