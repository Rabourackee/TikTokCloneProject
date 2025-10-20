export interface Video {
  id: string;
  url: string;
  caption: string;
  likes: number;
  comments: number;
  shares: number;
  username: string;
  userAvatar: string;
  createdAt: Date;
  // Admin management fields
  isVisible?: boolean;  // Whether to show in feed
  feedOrder?: number;   // Order in the feed (lower = first)
}

export interface UserInteraction {
  id: string;
  videoId: string;
  sessionId: string;
  userId?: string; // if user is logged in
  timestamp: Date;
  interactionType: 'view' | 'like' | 'share' | 'comment' | 'watch_complete';
  watchDuration?: number; // in seconds
  // Device/Browser info (like cookies data)
  deviceInfo: {
    userAgent: string;
    platform: string;
    language: string;
    screenResolution: string;
    viewport: string;
  };
  // Location info (from IP or browser)
  location?: {
    country?: string;
    city?: string;
    timezone: string;
  };
  // Referrer information
  referrer?: string;
}

export interface VideoAnalytics {
  videoId: string;
  totalViews: number;
  uniqueViews: number;
  totalWatchTime: number; // in seconds
  averageWatchTime: number;
  completionRate: number; // percentage
  likes: number;
  shares: number;
  comments: number;
  // Engagement metrics
  engagementRate: number; // (likes + comments + shares) / views
  // Device breakdown
  deviceBreakdown: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  // Time-based data
  viewsByHour: { [hour: string]: number };
  // Top locations
  topCountries: { country: string; views: number }[];
}

export interface UserSession {
  sessionId: string;
  userId?: string;
  startTime: Date;
  lastActivity: Date;
  videosWatched: string[];
  totalWatchTime: number;
  interactions: number;
  deviceInfo: UserInteraction['deviceInfo'];
  location?: UserInteraction['location'];
}

