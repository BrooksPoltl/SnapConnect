/**
 * CreateAIPostScreen - Screen for creating AI posts to share on feeds
 * Allows users to add commentary to AI responses and set privacy (public/friends)
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { createAIPost } from '../../services/ai';
import { logger } from '../../utils/logger';
import FormField from '../../components/FormField';
import { styles } from './styles';

interface RouteParams {
  aiResponse: string;
  sourceLink?: string;
}

const CreateAIPostScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const { aiResponse, sourceLink } = (route.params as RouteParams) ?? {};

  const [commentary, setCommentary] = useState('');
  const [privacy, setPrivacy] = useState<'public' | 'friends'>('public');
  const [isPosting, setIsPosting] = useState(false);

  /**
   * Handle posting the AI content to the feed
   */
  const handlePost = async () => {
    if (!aiResponse) {
      Alert.alert('Error', 'No AI response to post.');
      return;
    }

    try {
      setIsPosting(true);
      logger.log('CreateAIPostScreen: Creating AI post', {
        privacy,
        hasCommentary: !!commentary,
        hasSourceLink: !!sourceLink,
      });

      await createAIPost({
        commentary: commentary.trim() || '',
        ai_content: aiResponse,
        source_url: sourceLink,
        post_privacy: privacy,
      });

      logger.log('CreateAIPostScreen: Successfully created AI post');
      Alert.alert('Success', 'Your AI insight has been posted!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      logger.error('CreateAIPostScreen: Error creating post', error);
      Alert.alert('Error', 'Failed to post. Please try again.');
    } finally {
      setIsPosting(false);
    }
  };

  /**
   * Handle canceling the post creation
   */
  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Share AI Insight</Text>

        <TouchableOpacity
          onPress={handlePost}
          style={[styles.postButton, isPosting && styles.postButtonDisabled]}
          disabled={isPosting}
        >
          <Text style={[styles.postText, isPosting && styles.postTextDisabled]}>
            {isPosting ? 'Posting...' : 'Post'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Privacy Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Who can see this?</Text>
          <View style={styles.privacyContainer}>
            <TouchableOpacity
              style={[styles.privacyOption, privacy === 'public' && styles.privacyOptionSelected]}
              onPress={() => setPrivacy('public')}
            >
              <Ionicons
                name='globe-outline'
                size={20}
                color={privacy === 'public' ? '#007AFF' : '#666'}
              />
              <Text
                style={[styles.privacyText, privacy === 'public' && styles.privacyTextSelected]}
              >
                Public
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.privacyOption, privacy === 'friends' && styles.privacyOptionSelected]}
              onPress={() => setPrivacy('friends')}
            >
              <Ionicons
                name='people-outline'
                size={20}
                color={privacy === 'friends' ? '#007AFF' : '#666'}
              />
              <Text
                style={[styles.privacyText, privacy === 'friends' && styles.privacyTextSelected]}
              >
                Friends Only
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Commentary Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your thoughts (optional)</Text>
          <FormField
            placeholder='Add your commentary or insights...'
            value={commentary}
            onChangeText={setCommentary}
            multiline
            maxLength={500}
            containerStyle={{ marginBottom: 8 }}
          />
          <Text style={styles.characterCount}>{commentary.length}/500</Text>
        </View>

        {/* AI Response Preview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Response</Text>
          <View style={styles.aiResponseContainer}>
            <View style={styles.aiResponseHeader}>
              <Ionicons name='sparkles' size={16} color='#007AFF' />
              <Text style={styles.aiResponseLabel}>AI Insight</Text>
            </View>
            <Text style={styles.aiResponseText}>{aiResponse}</Text>
            {sourceLink && (
              <View style={styles.sourceContainer}>
                <Ionicons name='link-outline' size={14} color='#666' />
                <Text style={styles.sourceText}>Source: SEC Filing</Text>
              </View>
            )}
          </View>
        </View>

        {/* Preview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preview</Text>
          <View style={styles.previewContainer}>
            <View style={styles.previewHeader}>
              <View style={styles.previewAvatar} />
              <View style={styles.previewUserInfo}>
                <Text style={styles.previewUsername}>You</Text>
                <Text style={styles.previewTimestamp}>Now</Text>
              </View>
              <View style={styles.previewPrivacyBadge}>
                <Ionicons
                  name={privacy === 'public' ? 'globe-outline' : 'people-outline'}
                  size={12}
                  color='#666'
                />
              </View>
            </View>

            {commentary.trim() && <Text style={styles.previewCommentary}>{commentary.trim()}</Text>}

            <View style={styles.previewAiResponse}>
              <View style={styles.previewAiHeader}>
                <Ionicons name='sparkles' size={14} color='#007AFF' />
                <Text style={styles.previewAiLabel}>AI Insight</Text>
              </View>
              <Text style={styles.previewAiText}>{aiResponse}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreateAIPostScreen;
