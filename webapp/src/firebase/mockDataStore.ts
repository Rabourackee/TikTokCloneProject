import { Video, UserInteraction, VideoAnalytics, UserSession } from '../types/video';

/**
 * Shared mock data store for development mode
 * This persists video state (order, visibility) across admin and feed pages
 */

// Helper function to generate random device info
const generateDeviceInfo = () => {
  const platforms = ['Windows', 'MacOS', 'Linux', 'iOS', 'Android'];
  const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge'];
  const platform = platforms[Math.floor(Math.random() * platforms.length)];
  const browser = browsers[Math.floor(Math.random() * browsers.length)];
  
  return {
    userAgent: `Mozilla/5.0 (${platform}) ${browser}`,
    platform,
    language: Math.random() > 0.7 ? 'zh-CN' : 'en-US',
    screenResolution: '1920x1080',
    viewport: '1200x800',
  };
};

// Helper function to generate random location
const generateLocation = () => {
  const locations = [
    { country: 'United States', city: 'New York' },
    { country: 'China', city: 'Beijing' },
    { country: 'United Kingdom', city: 'London' },
    { country: 'Japan', city: 'Tokyo' },
    { country: 'Germany', city: 'Berlin' },
    { country: 'India', city: 'Mumbai' },
  ];
  const location = locations[Math.floor(Math.random() * locations.length)];
  
  return {
    ...location,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
};

// Initial mock videos
const initialMockVideos: Video[] = [
  {
    id: '1',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    caption: 'Beautiful nature video 🌸 #nature #beautiful',
    likes: 1250,
    comments: 89,
    shares: 23,
    username: 'nature_lover',
    userAvatar: 'https://i.pravatar.cc/150?img=1',
    createdAt: new Date(),
    isVisible: true,
    feedOrder: 0,
  },
  {
    id: '2',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    caption: 'Amazing animation! Check this out 🎨',
    likes: 2340,
    comments: 156,
    shares: 67,
    username: 'artist_pro',
    userAvatar: 'https://i.pravatar.cc/150?img=2',
    createdAt: new Date(),
    isVisible: true,
    feedOrder: 1,
  },
  {
    id: '3',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    caption: 'Epic moment! 🔥 #viral #trending',
    likes: 5670,
    comments: 234,
    shares: 123,
    username: 'creator123',
    userAvatar: 'https://i.pravatar.cc/150?img=3',
    createdAt: new Date(),
    isVisible: false,
    feedOrder: 2,
  },
  {
    id: '4',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    caption: 'Travel goals ✈️ #travel #adventure',
    likes: 3420,
    comments: 178,
    shares: 89,
    username: 'traveler_jane',
    userAvatar: 'https://i.pravatar.cc/150?img=4',
    createdAt: new Date(),
    isVisible: true,
    feedOrder: 3,
  },
  {
    id: '5',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    caption: 'Having fun! 😄 #fun #goodvibes',
    likes: 4560,
    comments: 201,
    shares: 98,
    username: 'fun_times',
    userAvatar: 'https://i.pravatar.cc/150?img=5',
    createdAt: new Date(),
    isVisible: true,
    feedOrder: 4,
  },
];

// In-memory store for mock videos
let mockVideos: Video[] = [...initialMockVideos];

/**
 * Get all mock videos (for admin panel)
 */
export const getMockVideos = (): Video[] => {
  return [...mockVideos].sort((a, b) => (a.feedOrder || 0) - (b.feedOrder || 0));
};

/**
 * Get visible mock videos (for video feed)
 */
export const getVisibleMockVideos = (): Video[] => {
  return mockVideos
    .filter(video => video.isVisible !== false)
    .sort((a, b) => (a.feedOrder || 0) - (b.feedOrder || 0));
};

/**
 * Update video visibility in mock store
 */
export const updateMockVideoVisibility = (videoId: string, isVisible: boolean): void => {
  mockVideos = mockVideos.map(video =>
    video.id === videoId ? { ...video, isVisible } : video
  );
};

/**
 * Batch update video orders in mock store
 */
export const batchUpdateMockVideoOrders = (updates: Array<{ id: string; feedOrder: number }>): void => {
  const orderMap = new Map(updates.map(({ id, feedOrder }) => [id, feedOrder]));
  
  mockVideos = mockVideos.map(video => {
    const newOrder = orderMap.get(video.id);
    return newOrder !== undefined ? { ...video, feedOrder: newOrder } : video;
  });
};

/**
 * Reset mock videos to initial state (useful for development)
 */
export const resetMockVideos = (): void => {
  mockVideos = [...initialMockVideos];
};

/**
 * Add a new video to mock store
 */
export const addMockVideo = (video: Omit<Video, 'id' | 'createdAt' | 'feedOrder'>): Video => {
  const newVideo: Video = {
    ...video,
    id: `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date(),
    feedOrder: mockVideos.length,
    isVisible: video.isVisible !== undefined ? video.isVisible : true,
  };
  mockVideos.push(newVideo);
  return newVideo;
};

/**
 * Update an existing video in mock store
 */
export const updateMockVideo = (videoId: string, updates: Partial<Omit<Video, 'id' | 'createdAt'>>): Video | null => {
  const index = mockVideos.findIndex(v => v.id === videoId);
  if (index === -1) return null;
  
  mockVideos[index] = {
    ...mockVideos[index],
    ...updates,
  };
  return mockVideos[index];
};

/**
 * Delete a video from mock store
 */
export const deleteMockVideo = (videoId: string): boolean => {
  const index = mockVideos.findIndex(v => v.id === videoId);
  if (index === -1) return false;
  
  mockVideos.splice(index, 1);
  // Reorder remaining videos
  mockVideos.forEach((video, idx) => {
    video.feedOrder = idx;
  });
  return true;
};

// ===== USER INTERACTION TRACKING =====

// Generate mock user interactions
const generateMockInteractions = (): UserInteraction[] => {
  const interactions: UserInteraction[] = [];
  const interactionTypes: UserInteraction['interactionType'][] = ['view', 'like', 'share', 'comment', 'watch_complete'];
  
  // Generate 100-200 random interactions across videos
  const numInteractions = Math.floor(Math.random() * 100) + 100;
  
  for (let i = 0; i < numInteractions; i++) {
    const video = mockVideos[Math.floor(Math.random() * mockVideos.length)];
    const interactionType = interactionTypes[Math.floor(Math.random() * interactionTypes.length)];
    const timestamp = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000); // Last 7 days
    
    interactions.push({
      id: `interaction_${i}`,
      videoId: video.id,
      sessionId: `session_${Math.floor(Math.random() * 50)}`,
      timestamp,
      interactionType,
      watchDuration: interactionType === 'view' || interactionType === 'watch_complete' 
        ? Math.floor(Math.random() * 180) : undefined,
      deviceInfo: generateDeviceInfo(),
      location: generateLocation(),
      referrer: Math.random() > 0.5 ? 'https://google.com' : 'https://twitter.com',
    });
  }
  
  return interactions;
};

// In-memory store for interactions
let mockInteractions: UserInteraction[] = generateMockInteractions();

/**
 * Get all interactions for a specific video
 */
export const getMockInteractionsForVideo = (videoId: string): UserInteraction[] => {
  return mockInteractions.filter(interaction => interaction.videoId === videoId);
};

/**
 * Get all interactions
 */
export const getAllMockInteractions = (): UserInteraction[] => {
  return [...mockInteractions];
};

/**
 * Track a new interaction (would be called from the video player)
 */
export const trackMockInteraction = (interaction: Omit<UserInteraction, 'id' | 'timestamp'>): void => {
  mockInteractions.push({
    ...interaction,
    id: `interaction_${Date.now()}_${Math.random()}`,
    timestamp: new Date(),
  });
};

/**
 * Get analytics for a specific video
 */
export const getMockVideoAnalytics = (videoId: string): VideoAnalytics => {
  const interactions = getMockInteractionsForVideo(videoId);
  const views = interactions.filter(i => i.interactionType === 'view');
  const uniqueSessions = new Set(views.map(i => i.sessionId)).size;
  const watchCompletions = interactions.filter(i => i.interactionType === 'watch_complete').length;
  
  const totalWatchTime = views.reduce((sum, v) => sum + (v.watchDuration || 0), 0);
  const avgWatchTime = views.length > 0 ? totalWatchTime / views.length : 0;
  
  const likes = interactions.filter(i => i.interactionType === 'like').length;
  const shares = interactions.filter(i => i.interactionType === 'share').length;
  const comments = interactions.filter(i => i.interactionType === 'comment').length;
  
  // Device breakdown
  const deviceBreakdown = { mobile: 0, desktop: 0, tablet: 0 };
  interactions.forEach(i => {
    const platform = i.deviceInfo.platform.toLowerCase();
    if (platform.includes('ios') || platform.includes('android')) {
      deviceBreakdown.mobile++;
    } else if (platform.includes('ipad')) {
      deviceBreakdown.tablet++;
    } else {
      deviceBreakdown.desktop++;
    }
  });
  
  // Views by hour
  const viewsByHour: { [hour: string]: number } = {};
  views.forEach(v => {
    const hour = v.timestamp.getHours().toString().padStart(2, '0');
    viewsByHour[hour] = (viewsByHour[hour] || 0) + 1;
  });
  
  // Top countries
  const countryMap = new Map<string, number>();
  interactions.forEach(i => {
    if (i.location?.country) {
      countryMap.set(i.location.country, (countryMap.get(i.location.country) || 0) + 1);
    }
  });
  const topCountries = Array.from(countryMap.entries())
    .map(([country, views]) => ({ country, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);
  
  return {
    videoId,
    totalViews: views.length,
    uniqueViews: uniqueSessions,
    totalWatchTime,
    averageWatchTime: avgWatchTime,
    completionRate: views.length > 0 ? (watchCompletions / views.length) * 100 : 0,
    likes,
    shares,
    comments,
    engagementRate: views.length > 0 ? ((likes + shares + comments) / views.length) * 100 : 0,
    deviceBreakdown,
    viewsByHour,
    topCountries,
  };
};

/**
 * Get all video analytics
 */
export const getAllMockVideoAnalytics = (): VideoAnalytics[] => {
  return mockVideos.map(video => getMockVideoAnalytics(video.id));
};

/**
 * Get all active user sessions
 */
export const getMockUserSessions = (): UserSession[] => {
  const sessionMap = new Map<string, UserSession>();
  
  mockInteractions.forEach(interaction => {
    if (!sessionMap.has(interaction.sessionId)) {
      sessionMap.set(interaction.sessionId, {
        sessionId: interaction.sessionId,
        userId: interaction.userId,
        startTime: interaction.timestamp,
        lastActivity: interaction.timestamp,
        videosWatched: [],
        totalWatchTime: 0,
        interactions: 0,
        deviceInfo: interaction.deviceInfo,
        location: interaction.location,
      });
    }
    
    const session = sessionMap.get(interaction.sessionId)!;
    
    // Update session
    if (interaction.timestamp > session.lastActivity) {
      session.lastActivity = interaction.timestamp;
    }
    if (interaction.timestamp < session.startTime) {
      session.startTime = interaction.timestamp;
    }
    
    if (interaction.interactionType === 'view' && !session.videosWatched.includes(interaction.videoId)) {
      session.videosWatched.push(interaction.videoId);
    }
    
    if (interaction.watchDuration) {
      session.totalWatchTime += interaction.watchDuration;
    }
    
    session.interactions++;
  });
  
  return Array.from(sessionMap.values()).sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime());
};

