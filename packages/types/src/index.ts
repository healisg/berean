export type UserLevel = 'beginner' | 'moderate' | 'experienced';

export type OpponentProfile =
  | 'jehovahs-witness'
  | 'muslim'
  | 'unitarian'
  | 'other';

export interface User {
  id: string;
  email: string;
  level: UserLevel;
}

export interface Doctrine {
  id: string;
  opponentProfile: OpponentProfile;
  title: string;
  summary: string;
  talkingPoints: string[];
  scriptureReferences: ScriptureReference[];
}

export interface ScriptureReference {
  book: string;
  chapter: number;
  verse: number;
  translation: string;
  text: string;
}

export interface ConversationMessage {
  role: 'user' | 'opponent' | 'assistant';
  content: string;
  timestamp: string;
}
