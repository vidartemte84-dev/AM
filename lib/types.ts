export type AttachmentStyle = 'secure' | 'anxious' | 'avoidant' | 'disorganized';

export interface AttachmentResult {
  style: AttachmentStyle;
  scores: Record<AttachmentStyle, number>;
  description: string;
}

export interface Prompt {
  question: string;
  answer: string;
}

export interface Profile {
  id: string;
  name: string;
  age: number;
  location: string;
  photos: string[];
  attachmentStyle: AttachmentStyle;
  bio: string;
  prompts: Prompt[];
  interests: string[];
  height?: string;
  pronouns?: string;
  job?: string;
  education?: string;
  compatibilityScore?: number;
}

export interface Match {
  profile: Profile;
  matchedAt: Date;
  compatibilityScore: number;
  isNew?: boolean;
}

export interface UserProfile extends Profile {
  quizAnswers?: number[];
}

export interface QuizQuestion {
  id: number;
  text: string;
  category: 'anxious' | 'avoidant' | 'secure' | 'disorganized';
  reverse?: boolean;
}

export interface LikedItem {
  profileId: string;
  type: 'photo' | 'prompt';
  index: number;
  comment?: string;
}
