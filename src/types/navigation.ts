import { CapturedMedia } from './media';

export type AuthStackParamList = {
  AuthHome: undefined;
  Login: undefined;
  SignUp: undefined;
  PhoneAuth: undefined;
};

export type UserStackParamList = {
  Main: undefined;
  Home: undefined;
  Camera: undefined;
  Chat: undefined;
  Map: undefined;
  Stories: undefined;
  Spotlight: undefined;
  Profile: { userId?: string };
  MediaPreview: { media: CapturedMedia };
  Friends: undefined;
};

export type ChatStackParamList = {
  ChatHome: undefined;
  Conversation: { userId: string; userName: string };
};
