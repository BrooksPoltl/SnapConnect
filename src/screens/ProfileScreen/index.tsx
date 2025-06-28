import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackScreenProps } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../styles/theme';
import { getUserProfile, updateUsername } from '../../services/user';
import { useAuthentication } from '../../utils/hooks/useAuthentication';
import { logger } from '../../utils/logger';
import { AnimatedPressable, FadeInAnimation, AnimatedCard, PulseAnimation } from '../../components';
import FormField from '../../components/FormField';

import { styles as createStyles } from './styles';

type ProfileScreenProps = StackScreenProps<Record<string, object | undefined>, 'Profile'>;

/**
 * Screen displaying a user's profile (username and score)
 * Allows current user to edit their username
 */
const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation, route }) => {
  const { userId } = route.params as { userId?: string };
  const { user: currentUser } = useAuthentication();

  const [profile, setProfile] = useState<{ username: string; score: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newUsername, setNewUsername] = useState('');

  const theme = useTheme();
  const styles = createStyles(theme);

  // Determine if this is the current user's profile
  const isOwnProfile = !userId || userId === currentUser?.id;
  const targetUserId = userId ?? currentUser?.id;

  /**
   * Load user profile data
   */
  const loadProfile = useCallback(async () => {
    if (!targetUserId) return;

    try {
      setLoading(true);
      const profileData = await getUserProfile(targetUserId);
      if (profileData) {
        setProfile(profileData);
        setNewUsername(profileData.username);
      }
    } catch (error) {
      logger.error('ProfileScreen', 'Error loading profile', error);
      Alert.alert('Error', 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, [targetUserId]);

  /**
   * Start editing username
   */
  const handleStartEdit = useCallback(() => {
    setEditing(true);
  }, []);

  /**
   * Cancel editing
   */
  const handleCancelEdit = useCallback(() => {
    setEditing(false);
    setNewUsername(profile?.username ?? '');
  }, [profile?.username]);

  /**
   * Save username changes
   */
  const handleSaveUsername = useCallback(async () => {
    if (!newUsername.trim()) {
      Alert.alert('Error', 'Username cannot be empty');
      return;
    }

    if (newUsername.trim() === (profile?.username ?? '')) {
      setEditing(false);
      return;
    }

    try {
      await updateUsername(newUsername.trim());
      setProfile(prev => (prev ? { ...prev, username: newUsername.trim() } : null));
      setEditing(false);
      Alert.alert('Success', 'Username updated successfully');
    } catch (error) {
      logger.error('ProfileScreen', 'Error updating username', error);
      Alert.alert('Error', 'Failed to update username');
    }
  }, [newUsername, profile?.username]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <FadeInAnimation>
          <View style={styles.header}>
            <AnimatedPressable onPress={() => navigation.goBack()} scaleValue={0.9}>
              <Ionicons name='arrow-back' size={24} color={theme.colors.text} />
            </AnimatedPressable>
            <Text style={styles.headerTitle}>Profile</Text>
            <View style={styles.headerSpacer} />
          </View>
        </FadeInAnimation>
        <FadeInAnimation delay={300}>
          <View style={styles.loadingContainer}>
            <PulseAnimation enabled={true} duration={1500}>
              <Text style={styles.loadingText}>Loading profile...</Text>
            </PulseAnimation>
          </View>
        </FadeInAnimation>
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView style={styles.container}>
        <FadeInAnimation>
          <View style={styles.header}>
            <AnimatedPressable onPress={() => navigation.goBack()} scaleValue={0.9}>
              <Ionicons name='arrow-back' size={24} color={theme.colors.text} />
            </AnimatedPressable>
            <Text style={styles.headerTitle}>Profile</Text>
            <View style={styles.headerSpacer} />
          </View>
        </FadeInAnimation>
        <FadeInAnimation delay={300}>
          <View style={styles.errorContainer}>
            <Ionicons name='person-circle-outline' size={64} color={theme.colors.textSecondary} />
            <Text style={styles.errorText}>Profile not found</Text>
          </View>
        </FadeInAnimation>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FadeInAnimation duration={500}>
        <View style={styles.header}>
          <AnimatedPressable onPress={() => navigation.goBack()} scaleValue={0.9}>
            <Ionicons name='arrow-back' size={24} color={theme.colors.text} />
          </AnimatedPressable>
          <Text style={styles.headerTitle}>{isOwnProfile ? 'My Profile' : 'Profile'}</Text>
          <View style={styles.headerSpacer} />
        </View>
      </FadeInAnimation>

      <FadeInAnimation delay={200} duration={600}>
        <View style={styles.content}>
          <AnimatedCard
            elevation='medium'
            gradient={true}
            enterFromDirection='bottom'
            delay={400}
            duration={800}
          >
            <View style={styles.profileCard}>
              <FadeInAnimation delay={600} duration={500}>
                <View style={styles.avatarContainer}>
                  <Ionicons name='person-circle' size={80} color={theme.colors.primary} />
                </View>
              </FadeInAnimation>

              <View style={styles.profileInfo}>
                <FadeInAnimation delay={700} duration={500}>
                  <View style={styles.usernameSection}>
                    <Text style={styles.usernameLabel}>Username</Text>
                    {editing ? (
                      <View style={styles.editContainer}>
                        <FormField
                          variant='inline'
                          value={newUsername}
                          onChangeText={setNewUsername}
                          placeholder='Enter username'
                          autoCapitalize='none'
                          autoCorrect={false}
                          maxLength={30}
                          containerStyle={{ flex: 1 }}
                        />
                        <View style={styles.editActions}>
                          <AnimatedPressable
                            style={[styles.editButton, styles.cancelButton]}
                            onPress={handleCancelEdit}
                            scaleValue={0.9}
                          >
                            <Ionicons name='close' size={16} color={theme.colors.text} />
                          </AnimatedPressable>
                          <AnimatedPressable
                            style={[styles.editButton, styles.saveButton]}
                            onPress={handleSaveUsername}
                            scaleValue={0.9}
                          >
                            <Ionicons name='checkmark' size={16} color={theme.colors.white} />
                          </AnimatedPressable>
                        </View>
                      </View>
                    ) : (
                      <View style={styles.usernameDisplay}>
                        <Text style={styles.username}>{profile.username}</Text>
                        {isOwnProfile && (
                          <AnimatedPressable
                            style={styles.editIconButton}
                            onPress={handleStartEdit}
                            scaleValue={0.8}
                          >
                            <Ionicons name='pencil' size={16} color={theme.colors.primary} />
                          </AnimatedPressable>
                        )}
                      </View>
                    )}
                  </View>
                </FadeInAnimation>

                <FadeInAnimation delay={800} duration={500}>
                  <View style={styles.scoreSection}>
                    <Text style={styles.scoreLabel}>Score</Text>
                    <PulseAnimation enabled={true} duration={3000} minScale={1} maxScale={1.05}>
                      <Text style={styles.score}>{profile.score.toLocaleString()}</Text>
                    </PulseAnimation>
                  </View>
                </FadeInAnimation>
              </View>
            </View>
          </AnimatedCard>

          {isOwnProfile && (
            <FadeInAnimation delay={1000} duration={600}>
              <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>How to increase your score:</Text>
                <Text style={styles.infoText}>• Post stories: +10 points</Text>
                <Text style={styles.infoText}>• Send messages: +5 points</Text>
              </View>
            </FadeInAnimation>
          )}
        </View>
      </FadeInAnimation>
    </SafeAreaView>
  );
};

export default ProfileScreen;
