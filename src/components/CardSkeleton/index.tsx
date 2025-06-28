import React from 'react';
import { View } from 'react-native';

import { useTheme } from '../../styles/theme';
import SkeletonLoader from '../SkeletonLoader';

import { styles } from './styles';

interface CardSkeletonProps {
  count?: number;
  showAvatar?: boolean;
  showImage?: boolean;
  showActions?: boolean;
  variant?: 'post' | 'story' | 'compact';
}

/**
 * Flexible card skeleton component for various content types
 * Can be configured for posts, stories, or other card-based content
 *
 * @param count - Number of skeleton cards to render (default: 3)
 * @param showAvatar - Whether to show avatar skeleton (default: true)
 * @param showImage - Whether to show image placeholder skeleton (default: true)
 * @param showActions - Whether to show action buttons skeleton (default: true)
 * @param variant - Style variant for different card types
 */
const CardSkeleton: React.FC<CardSkeletonProps> = ({
  count = 3,
  showAvatar = true,
  showImage = true,
  showActions = true,
  variant = 'post',
}) => {
  const theme = useTheme();
  const dynamicStyles = styles(theme);

  const getCardHeight = () => {
    switch (variant) {
      case 'story':
        return 120;
      case 'compact':
        return 80;
      default:
        return 200;
    }
  };

  const renderSkeletonCard = (index: number) => (
    <View key={index} style={dynamicStyles.cardContainer}>
      {/* Header with avatar and name */}
      {showAvatar && (
        <View style={dynamicStyles.headerSkeleton}>
          <SkeletonLoader
            width={40}
            height={40}
            borderRadius={20}
            style={dynamicStyles.avatarSkeleton}
          />
          <View style={dynamicStyles.headerContent}>
            <SkeletonLoader width='60%' height={14} style={dynamicStyles.nameSkeleton} />
            <SkeletonLoader width='40%' height={12} style={dynamicStyles.timeSkeleton} />
          </View>
        </View>
      )}

      {/* Main content/image skeleton */}
      {showImage && (
        <SkeletonLoader width='100%' height={getCardHeight()} style={dynamicStyles.imageSkeleton} />
      )}

      {/* Content text skeleton */}
      {variant === 'post' && (
        <View style={dynamicStyles.textContent}>
          <SkeletonLoader width='95%' height={14} style={dynamicStyles.textLine} />
          <SkeletonLoader width='70%' height={14} style={dynamicStyles.textLine} />
        </View>
      )}

      {/* Action buttons skeleton */}
      {showActions && variant === 'post' && (
        <View style={dynamicStyles.actionsSkeleton}>
          <SkeletonLoader width={24} height={24} style={dynamicStyles.actionButton} />
          <SkeletonLoader width={24} height={24} style={dynamicStyles.actionButton} />
          <SkeletonLoader width={24} height={24} style={dynamicStyles.actionButton} />
        </View>
      )}
    </View>
  );

  return (
    <View style={dynamicStyles.container}>
      {Array.from({ length: count }, (_, index) => renderSkeletonCard(index))}
    </View>
  );
};

export default CardSkeleton;
