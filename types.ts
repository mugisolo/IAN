
export enum ViewState {
  VERANDA_HOME = 'VERANDA_HOME',
  VERANDA_MISSION = 'VERANDA_MISSION',
  VERANDA_JOIN = 'VERANDA_JOIN',
  VERANDA_REGISTER = 'VERANDA_REGISTER',
  VERANDA_LEGACY = 'VERANDA_LEGACY',
  VAULT_DASHBOARD = 'VAULT_DASHBOARD',
  VAULT_ARCHIE = 'VAULT_ARCHIE',
  VAULT_DIRECTORY = 'VAULT_DIRECTORY',
  VAULT_WELLBEING = 'VAULT_WELLBEING',
  VAULT_FORUM = 'VAULT_FORUM',
  VAULT_EVENTS = 'VAULT_EVENTS',
  VAULT_MEMBERSHIP = 'VAULT_MEMBERSHIP',
  VAULT_VERIFICATION = 'VAULT_VERIFICATION'
}

export type LanguageCode = 'en' | 'fr' | 'es' | 'ar';

export interface Member {
  id: string;
  name: string;
  role: string; // e.g., "Legacy Fellow"
  years: string;
  languages: string[];
  pillars: string[];
  location: string;
  avatarUrl: string;
  youtubeUrl?: string;
  verified?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface MembershipTier {
  name: string;
  fee: string;
  target: string;
  benefits: string[];
}

export interface ForumTopic {
  id: string;
  title: string;
  description: string;
  category: string;
  activeCount: number;
  lastActive: string;
}

export interface AppEvent {
  id: string;
  title: string;
  description: string;
  location?: string;
  date: string;
  time: string;
  type: 'Social' | 'Webinar' | 'Official';
  host: string;
  attendees: number;
  maxGuests?: number;
  isRsvped?: boolean;
}

export interface ForumPost {
  id: string;
  author: string;
  role: string;
  content: string;
  timestamp: string;
  replies?: ForumPost[];
}
