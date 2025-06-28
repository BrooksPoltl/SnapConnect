import React from 'react';
import { View } from 'react-native';

import { useTheme } from '../../styles/theme';
import SkeletonLoader from '../SkeletonLoader';

import { styles } from './styles';

interface AIConversationSkeletonProps {
  count?: number;
}

/**
 * Skeleton loader for AI conversation list items
 * Mimics the structure of AI conversation items with titles and metadata
 *
 * @param count - Number of skeleton items to render (default: 6)
 */
const AIConversationSkeleton: React.FC<AIConversationSkeletonProps> = ({ count = 6 }) => {
  const theme = useTheme();
  const dynamicStyles = styles(theme);

  const renderSkeletonItem = (index: number) => (
    <View key={index} style={dynamicStyles.skeletonItem}>
      {/* AI icon skeleton */}
      <SkeletonLoader width={40} height={40} borderRadius={20} style={dynamicStyles.iconSkeleton} />

      {/* Content skeleton */}
      <View style={dynamicStyles.contentSkeleton}>
        {/* Title skeleton - varying widths for realism */}
        <SkeletonLoader
          width={index % 3 === 0 ? '75%' : index % 2 === 0 ? '60%' : '85%'}
          height={16}
          style={dynamicStyles.titleSkeleton}
        />

        {/* Metadata skeleton */}
        <SkeletonLoader width='45%' height={12} style={dynamicStyles.metaSkeleton} />
      </View>

      {/* Chevron skeleton */}
      <SkeletonLoader width={16} height={16} style={dynamicStyles.chevronSkeleton} />
    </View>
  );

  return (
    <View style={dynamicStyles.container}>
      {Array.from({ length: count }, (_, index) => renderSkeletonItem(index))}
    </View>
  );
};

export default AIConversationSkeleton;
