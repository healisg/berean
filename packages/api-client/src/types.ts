import type { UserLevel, OpponentProfile, ConversationMessage } from '@berean/types';

export interface ChatOptions {
  userLevel: UserLevel;
  opponentProfile: OpponentProfile;
  history: ConversationMessage[];
  userMessage: string;
}

export interface ChatResponse {
  content: string;
  cached: boolean;
}
