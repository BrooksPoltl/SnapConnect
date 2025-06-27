import {
  useNavigation as useUntypedNavigation,
  NavigatorScreenParams,
} from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CapturedMedia } from './media';
import { Story } from './stories';

export type AuthStackParamList = {
  AuthHome: undefined;
  Login: undefined;
  SignUp: undefined;
  PhoneAuth: undefined;
  Conversation: { chatId: number; otherUserId: string; otherUsername: string };
  MediaViewer: { storage_path: string; content_type: 'image' | 'video' };
  SelectRecipients: { media: CapturedMedia };
};

export type MainTabParamList = {
  Insights: undefined;
  ChatStack: undefined;
  Camera: undefined;
  Stories: undefined;
  Spotlight: undefined;
};

export type UserStackParamList = {
  Main: NavigatorScreenParams<MainTabParamList>;
  Home: undefined;
  Camera: undefined;
  Chat: undefined;
  Map: undefined;
  Stories: undefined;
  Spotlight: undefined;
  Profile: { userId?: string };
  MediaPreview: { media: CapturedMedia };
  Friends: undefined;
  Conversation: { chatId: number; otherUserId: string; otherUsername: string };
  MediaViewer: { storage_path: string; content_type: 'image' | 'video' };
  SelectRecipients: { media: CapturedMedia };
  StoryViewer: {
    stories: Story[];
    username: string;
  };
  MyStoryViewer: {
    stories: Story[];
  };
  AIChatScreen: {
    conversationId?: string | null;
    conversationTitle?: string;
  };
  CreateAIPostScreen: {
    aiResponse: string;
    sourceLink?: string;
  };
  CreateGroup: undefined;
  GroupConversation: { groupId: string; groupName: string };
};

export type ChatStackParamList = {
  ChatHome: undefined;
  Conversation: { userId: string; userName: string };
};

// --- Composite Root Stack Param List ---
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  User: NavigatorScreenParams<UserStackParamList>;
  // Add other root-level stacks here if any (e.g. Modals)
};

// --- Custom Hook for Typed Navigation ---
export const useNavigation = () =>
  useUntypedNavigation<NativeStackScreenProps<RootStackParamList>['navigation']>();

// --- Screen Props for use in components ---
export type RootStackScreenProps<T extends keyof (AuthStackParamList & UserStackParamList)> =
  NativeStackScreenProps<AuthStackParamList & UserStackParamList, T>;
