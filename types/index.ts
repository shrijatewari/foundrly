export interface Post {
  id: string;
  founderName: string;
  startupName: string;
  content: string;
  likes: number;
  comments: number;
  timeAgo: string;
}

export interface FounderProfile {
  id: string;
  name: string;
  startupName: string;
  role: string;
  bio: string;
  stage: string;
  industry: string;
  location: string;
  website: string;
  followers: number;
  following: number;
  posts: number;
  avatarUrl: string;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export interface StartupHealth {
  name: string;
  stage: string;
  progress: number;
  aiSuggestions: string[];
  dailyTasks: Task[];
  upcomingEvent: UpcomingEvent;
}

export interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
