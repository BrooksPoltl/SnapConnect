import React, { memo } from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraCapturedPicture } from 'expo-camera';

import { useTheme } from '../../styles/theme';

import { styles } from './styles';

interface PhotoPreviewProps {
  photo: CameraCapturedPicture;
  hasMediaLibraryPermission?: boolean;
  onSave: () => void;
  onShare: () => void;
  onDiscard: () => void;
}

const PhotoPreview: React.FC<PhotoPreviewProps> = memo(
  ({ photo, hasMediaLibraryPermission = false, onSave, onShare, onDiscard }) => {
    const theme = useTheme();
    const dynamicStyles = styles(theme);

    return (
      <SafeAreaView style={dynamicStyles.container}>
        <Image
          style={dynamicStyles.preview}
          source={{ uri: `data:image/jpg;base64,${photo.base64}` }}
        />
        <View style={dynamicStyles.photoActions}>
          {hasMediaLibraryPermission && (
            <TouchableOpacity
              style={[dynamicStyles.actionButton, dynamicStyles.saveButton]}
              onPress={onSave}
              accessibilityRole='button'
              accessibilityLabel='Save photo'
            >
              <Text style={dynamicStyles.actionButtonText}>Save</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[dynamicStyles.actionButton, dynamicStyles.shareButton]}
            onPress={onShare}
            accessibilityRole='button'
            accessibilityLabel='Share photo'
          >
            <Text style={dynamicStyles.actionButtonText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[dynamicStyles.actionButton, dynamicStyles.discardButton]}
            onPress={onDiscard}
            accessibilityRole='button'
            accessibilityLabel='Discard photo'
          >
            <Text style={dynamicStyles.actionButtonText}>Discard</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  },
);

PhotoPreview.displayName = 'PhotoPreview';

export default PhotoPreview;
