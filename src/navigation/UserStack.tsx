import React, { useEffect, useState } from 'react';
import {
  // Button, // Temporarily commented out
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {
  createStackNavigator,
  StackNavigationOptions,
  TransitionPresets,
} from '@react-navigation/stack';
// import { logOut } from '../services/auth'; // Temporarily commented out
import { useChatStore, useUnreadCount, useGroupStore } from '../stores';

import AIHomeScreen from '../screens/AIHomeScreen';
import AIChatScreen from '../screens/AIChatScreen';
import CreateAIPostScreen from '../screens/CreateAIPostScreen';
import CameraScreen from '../screens/CameraScreen';
import { StoriesScreen } from '../screens/StoriesScreen';
import FeedScreen from '../screens/FeedScreen';
import MediaPreviewScreen from '../screens/MediaPreviewScreen';
import ConversationScreen from '../screens/ConversationScreen';
// import { logError } from '../utils/logger'; // Temporarily commented out
import { Icon } from '../components';
import { useTheme } from '../styles/theme';
import { UserStackParamList } from '../types/navigation';
import { useAuthentication } from '../utils/hooks/useAuthentication';

import ChatStack from './ChatStack';
import FriendsStack from './FriendsStack';
import { MediaViewerScreen } from '../screens/MediaViewerScreen';
import { SelectRecipientsScreen } from '../screens/SelectRecipientsScreen';
import { StoryViewerScreen } from '../screens/StoryViewerScreen';
import { MyStoryViewerScreen } from '../screens/MyStoryViewerScreen';
import { CreateGroupScreen } from '../screens/CreateGroupScreen';
import { GroupConversationScreen } from '../screens/GroupConversationScreen';
import { GroupDetailsScreen } from '../screens/GroupDetailsScreen';
import { AddGroupMembersScreen } from '../screens/AddGroupMembersScreen';

const Stack = createStackNavigator<UserStackParamList>();

// Tab configuration with order for transitions
const TABS = [
  { key: 'Home', name: 'Home', component: FeedScreen, icon: 'home' },
  { key: 'Insights', name: 'Insights', component: AIHomeScreen, icon: 'auto-awesome' },
  { key: 'ChatStack', name: 'ChatStack', component: ChatStack, icon: 'message-square' },
  { key: 'Camera', name: 'Camera', component: CameraScreen, icon: 'camera' },
  { key: 'Stories', name: 'Stories', component: StoriesScreen, icon: 'users' },
];

const { width: screenWidth } = Dimensions.get('window');

const getIconName = (routeName: string): string => {
  const tab = TABS.find(t => t.key === routeName);
  return tab?.icon ?? 'help-circle';
};

/**
 * Custom Tab Navigator with smooth left/right transitions
 */
const CustomTabNavigator: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuthentication();
  const { unreadCount } = useUnreadCount();
  const { initializeRealtime, refreshUnreadCount, refreshConversations, reset } = useChatStore();
  const { loadGroups, reset: resetGroups } = useGroupStore();

  const [activeTabIndex, setActiveTabIndex] = useState(0); // Start with Home
  const [slideAnim] = useState(new Animated.Value(0)); // Start at Home position

  // Initialize store and real-time subscriptions when user changes
  useEffect(() => {
    if (user) {
      initializeRealtime(user);
      refreshUnreadCount();
      refreshConversations();
      loadGroups();
    } else {
      reset();
      resetGroups();
    }
  }, [
    user,
    initializeRealtime,
    refreshUnreadCount,
    refreshConversations,
    reset,
    loadGroups,
    resetGroups,
  ]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    contentContainer: {
      flex: 1,
      flexDirection: 'row',
      width: screenWidth * TABS.length,
    },
    tabScreen: {
      width: screenWidth,
      flex: 1,
    },
    tabBar: {
      flexDirection: 'row',
      backgroundColor: theme.colors.background,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      elevation: 8,
      shadowColor: theme.colors.cardShadow,
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      paddingBottom: 20,
      paddingTop: 10,
    },
    tabButton: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 8,
    },
    iconContainer: {
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center',
    },
    badge: {
      position: 'absolute',
      top: -8,
      right: -8,
      backgroundColor: theme.colors.primary,
      borderRadius: 10,
      minWidth: 20,
      height: 20,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 6,
    },
    badgeText: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.colors.white,
    },
    // Temporarily commented out logout button style
    // logoutButton: {
    //   position: 'absolute',
    //   top: 50,
    //   left: 20,
    //   zIndex: 1000,
    // },
  });

  const handleTabPress = (index: number) => {
    if (index === activeTabIndex) return;

    const newPosition = -screenWidth * index;

    setActiveTabIndex(index);

    Animated.timing(slideAnim, {
      toValue: newPosition,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Logout function temporarily commented out
  // const handleLogOut = async () => {
  //   try {
  //     await logOut();
  //   } catch (error: unknown) {
  //     // logError('UserStack', 'Sign out error', error);
  //   }
  // };

  const renderTabIcon = (tabKey: string, index: number) => {
    const iconName = getIconName(tabKey);
    const isActive = index === activeTabIndex;
    const iconColor = isActive ? theme.colors.primary : theme.colors.textSecondary;

    if (tabKey === 'ChatStack' && unreadCount > 0) {
      return (
        <View style={styles.iconContainer}>
          <Icon
            name={iconName}
            size={24}
            color={iconColor}
            backgroundContainer={isActive}
            containerColor={isActive ? '#007AFF' : undefined}
            containerSize={isActive ? 40 : undefined}
            enable3D={isActive}
            shadowColor={isActive ? '#007AFF' : undefined}
            shadowOpacity={isActive ? 0.5 : undefined}
          />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.iconContainer}>
        <Icon
          name={iconName}
          size={24}
          color={iconColor}
          backgroundContainer={isActive}
          containerColor={isActive ? '#007AFF' : undefined}
          containerSize={isActive ? 40 : undefined}
          enable3D={isActive}
          shadowColor={isActive ? '#007AFF' : undefined}
          shadowOpacity={isActive ? 0.5 : undefined}
        />
      </View>
    );
  };

  const renderTabButton = (tab: (typeof TABS)[0], index: number) => (
    <TouchableOpacity
      key={tab.key}
      style={styles.tabButton}
      onPress={() => handleTabPress(index)}
      activeOpacity={0.7}
    >
      {renderTabIcon(tab.key, index)}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Logout button temporarily commented out for cleaner design */}
      {/* <View style={styles.logoutButton}>
        <Button onPress={handleLogOut} title='Log Out' />
      </View> */}

      <Animated.View
        style={[
          styles.contentContainer,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        {TABS.map((tab, _index) => {
          const TabComponent = tab.component;
          return (
            <View key={tab.key} style={styles.tabScreen}>
              <TabComponent />
            </View>
          );
        })}
      </Animated.View>

      <View style={styles.tabBar}>{TABS.map((tab, index) => renderTabButton(tab, index))}</View>
    </View>
  );
};

/**
 * Main user stack navigator with enhanced transitions
 * Includes tab navigation and modal/overlay screens like MediaPreview
 */
const UserStack: React.FC = () => {
  // Enhanced stack transitions using React Navigation's built-in presets
  const stackScreenOptions: StackNavigationOptions = {
    headerShown: false,
    gestureEnabled: true,
    ...TransitionPresets.SlideFromRightIOS,
  };

  // Modal screen options with slide up animation
  const modalScreenOptions: StackNavigationOptions = {
    headerShown: false,
    presentation: 'modal',
    gestureEnabled: true,
    ...TransitionPresets.ModalPresentationIOS,
  };

  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen name='Main' component={CustomTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen
        name='MediaPreview'
        component={MediaPreviewScreen}
        options={modalScreenOptions}
      />
      <Stack.Screen name='Friends' component={FriendsStack} options={modalScreenOptions} />
      <Stack.Screen
        name='Conversation'
        component={ConversationScreen}
        options={stackScreenOptions}
      />
      <Stack.Screen name='MediaViewer' component={MediaViewerScreen} options={modalScreenOptions} />
      <Stack.Screen
        name='SelectRecipients'
        component={SelectRecipientsScreen}
        options={modalScreenOptions}
      />
      <Stack.Screen name='StoryViewer' component={StoryViewerScreen} options={modalScreenOptions} />
      <Stack.Screen
        name='MyStoryViewer'
        component={MyStoryViewerScreen}
        options={modalScreenOptions}
      />
      <Stack.Screen name='AIChatScreen' component={AIChatScreen} options={stackScreenOptions} />
      <Stack.Screen
        name='CreateAIPostScreen'
        component={CreateAIPostScreen}
        options={modalScreenOptions}
      />
      <Stack.Screen name='CreateGroup' component={CreateGroupScreen} options={modalScreenOptions} />
      <Stack.Screen
        name='GroupConversation'
        component={GroupConversationScreen}
        options={stackScreenOptions}
      />
      <Stack.Screen
        name='GroupDetails'
        component={GroupDetailsScreen}
        options={stackScreenOptions}
      />
      <Stack.Screen
        name='AddGroupMembers'
        component={AddGroupMembersScreen}
        options={modalScreenOptions}
      />
    </Stack.Navigator>
  );
};

export default UserStack;
