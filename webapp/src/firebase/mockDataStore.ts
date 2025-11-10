import { Video, UserInteraction, VideoAnalytics, UserSession, VideoGroup } from '../types/video';

// Interface for the JSON data structure
interface JsonVideoData {
  id: number;
  username: string;
  handle: string | null;
  caption: string;
  likes: number | null;
  comments: number;
  shares: number;
  video_url: string;
  thumbnail_url: string;
  page_url: string;
}

/**
 * Shared mock data store for development mode
 * This persists video state (order, visibility) across admin and feed pages
 */

/**
 * Load videos from JSON file
 */
const loadVideosFromJson = async (): Promise<Video[]> => {
  try {
    // URL encode the filename to handle spaces and special characters
    const jsonPath = '/videos_in_url/sora_feed_metadata%20(7).json';
    const response = await fetch(jsonPath);
    if (!response.ok) {
      throw new Error(`Failed to load videos JSON: ${response.status} ${response.statusText}`);
    }
    const jsonData: JsonVideoData[] = await response.json();
    
    // Transform JSON data to Video format
    return jsonData.map((item, index) => ({
      id: item.id.toString(),
      url: item.video_url,
      caption: item.caption || 'Amazing video! 🎥',
      likes: item.likes || Math.floor(Math.random() * 5000) + 1000,
      comments: item.comments || 0,
      shares: item.shares || 0,
      username: item.username || 'unknown_user',
      userAvatar: `https://i.pravatar.cc/150?img=${(item.id % 70) + 1}`,
      createdAt: new Date(),
      isVisible: true,
      feedOrder: index,
    }));
  } catch (error) {
    console.error('Error loading videos from JSON:', error);
    return [];
  }
};

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

// Initial mock videos - using local videos from public/videos folder
const initialMockVideos: Video[] = [
  {
    id: '1',
    url: 'https://firebasestorage.googleapis.com/v0/b/sampele-c950a.firebasestorage.app/o/34e772f6cd5bf10_00000000-ab48-7284-9ac1-7dc270aaeaab%252Fdrvs%252Fmd%252Fraw.mp4?alt=media&token=e920b749-0032-4d41-a982-08ebfaa2c537',
    caption: 'Amazing video 🎥 #viral #trending',
    likes: 1250,
    comments: 89,
    shares: 23,
    username: 'creator_one',
    userAvatar: 'https://i.pravatar.cc/150?img=1',
    createdAt: new Date(),
    isVisible: true,
    feedOrder: 0,
  },
  {
    id: '2',
    url: '/videos/19700121_0430_69093505098c8191a45ca60f2e52e75d.mp4',
    caption: 'Check this out! 🌟 #awesome #cool',
    likes: 2340,
    comments: 156,
    shares: 67,
    username: 'creator_two',
    userAvatar: 'https://i.pravatar.cc/150?img=2',
    createdAt: new Date(),
    isVisible: true,
    feedOrder: 1,
  },
  {
    id: '3',
    url: '/videos/19700121_0431_690a2bd205a8819186983bd84209cb51.mp4',
    caption: 'Epic moment! 🔥 #viral #trending',
    likes: 5670,
    comments: 234,
    shares: 123,
    username: 'creator_three',
    userAvatar: 'https://i.pravatar.cc/150?img=3',
    createdAt: new Date(),
    isVisible: true,
    feedOrder: 2,
  },
  {
    id: '4',
    url: '/videos/19700121_0431_690a2d1309808191bed6bf12a20f4976.mp4',
    caption: 'You gotta see this! ✨ #amazing #wow',
    likes: 3420,
    comments: 178,
    shares: 89,
    username: 'creator_four',
    userAvatar: 'https://i.pravatar.cc/150?img=4',
    createdAt: new Date(),
    isVisible: true,
    feedOrder: 3,
  },
  {
    id: '5',
    url: '/videos/19700121_0431_690a4cc3a99c8191921f3abd4eb14115.mp4',
    caption: 'This is incredible! 😍 #love #beautiful',
    likes: 4560,
    comments: 201,
    shares: 98,
    username: 'creator_five',
    userAvatar: 'https://i.pravatar.cc/150?img=5',
    createdAt: new Date(),
    isVisible: true,
    feedOrder: 4,
  },
  {
    id: '6',
    url: '/videos/19700121_0431_690a4ed3640c8191b2a74c4d1fc51653.mp4',
    caption: 'Mind blown! 🤯 #mindblowing #crazy',
    likes: 3890,
    comments: 145,
    shares: 76,
    username: 'creator_six',
    userAvatar: 'https://i.pravatar.cc/150?img=6',
    createdAt: new Date(),
    isVisible: true,
    feedOrder: 5,
  },
  {
    id: '7',
    url: '/videos/19700121_0431_690ab66479e88191b2f33b7d9673fe7d.mp4',
    caption: 'Pure magic! ✨ #magic #amazing',
    likes: 5234,
    comments: 189,
    shares: 112,
    username: 'creator_seven',
    userAvatar: 'https://i.pravatar.cc/150?img=7',
    createdAt: new Date(),
    isVisible: true,
    feedOrder: 6,
  },
  {
    id: '8',
    url: '/videos/19700121_0432_690b9bc1d6a081919f38baca9f334cbd.mp4',
    caption: 'Unbelievable! 🎬 #video #content',
    likes: 2987,
    comments: 123,
    shares: 54,
    username: 'creator_eight',
    userAvatar: 'https://i.pravatar.cc/150?img=8',
    createdAt: new Date(),
    isVisible: true,
    feedOrder: 7,
  },
  {
    id: '9',
    url: '/videos/19700121_0433_690c22dc4bb48191aa3f71b0415d79eb.mp4',
    caption: 'So cool! 😎 #cool #awesome',
    likes: 4123,
    comments: 167,
    shares: 91,
    username: 'creator_nine',
    userAvatar: 'https://i.pravatar.cc/150?img=9',
    createdAt: new Date(),
    isVisible: true,
    feedOrder: 8,
  },
  {
    id: '10',
    url: '/videos/19700121_0434_690d5b7c36148191b52683a6ce388f6b.mp4',
    caption: 'Must watch! 🎯 #mustsee #viral',
    likes: 6789,
    comments: 278,
    shares: 145,
    username: 'creator_ten',
    userAvatar: 'https://i.pravatar.cc/150?img=10',
    createdAt: new Date(),
    isVisible: true,
    feedOrder: 9,
  },
];

// In-memory store for mock videos - will be loaded from JSON
let mockVideos: Video[] = [];
let mockInteractions: UserInteraction[] = [];
let loadingPromise: Promise<void> | null = null;

// Initialize video loading
const initializeVideos = (): Promise<void> => {
  if (!loadingPromise) {
    loadingPromise = loadVideosFromJson().then(videos => {
      if (videos.length > 0) {
        mockVideos = videos;
        console.log(`✅ Loaded ${videos.length} videos from JSON file`);
      } else {
        console.warn('⚠️ No videos found in JSON file, using fallback data');
        // Use fallback data if JSON is empty
        mockVideos = [...initialMockVideos];
      }
      // Generate mock interactions after videos are loaded
      mockInteractions = generateMockInteractions();
      console.log(`✅ Generated ${mockInteractions.length} mock interactions`);
    }).catch(error => {
      console.error('❌ Failed to initialize videos from JSON:', error);
      console.log('Using fallback video data');
      // Use fallback data on error
      mockVideos = [...initialMockVideos];
      // Generate mock interactions after fallback videos are loaded
      mockInteractions = generateMockInteractions();
    });
  }
  return loadingPromise;
};

// Start loading immediately
initializeVideos();

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
 * Get all mock videos asynchronously (waits for loading to complete)
 */
export const getMockVideosAsync = async (): Promise<Video[]> => {
  await initializeVideos();
  return getMockVideos();
};

/**
 * Get visible mock videos asynchronously (waits for loading to complete)
 */
export const getVisibleMockVideosAsync = async (): Promise<Video[]> => {
  await initializeVideos();
  return getVisibleMockVideos();
};

/**
 * Group videos by username and caption for Sora-style horizontal swiping
 * Videos with the same username AND caption will be grouped together
 */
export const groupVideosByUserAndCaption = (videos: Video[]): VideoGroup[] => {
  // Create a map to group videos
  const groupMap = new Map<string, Video[]>();
  
  videos.forEach(video => {
    // Create a unique key for each username + caption combination
    const key = `${video.username}|||${video.caption}`;
    
    if (!groupMap.has(key)) {
      groupMap.set(key, []);
    }
    groupMap.get(key)!.push(video);
  });
  
  // Convert map to array of VideoGroup objects
  const groups: VideoGroup[] = [];
  let groupOrder = 0;
  
  groupMap.forEach((videos, key) => {
    const [username, caption] = key.split('|||');
    groups.push({
      id: `group_${groupOrder}`,
      username,
      caption,
      videos: videos.sort((a, b) => (a.feedOrder || 0) - (b.feedOrder || 0)),
      groupOrder: groupOrder++,
    });
  });
  
  // Sort groups by the feed order of their first video
  return groups.sort((a, b) => {
    const aFirstOrder = a.videos[0]?.feedOrder || 0;
    const bFirstOrder = b.videos[0]?.feedOrder || 0;
    return aFirstOrder - bFirstOrder;
  });
};

/**
 * Get grouped videos (for Sora-style feed)
 */
export const getGroupedMockVideos = (): VideoGroup[] => {
  const visibleVideos = getVisibleMockVideos();
  return groupVideosByUserAndCaption(visibleVideos);
};

/**
 * Get grouped videos asynchronously (waits for loading to complete)
 */
export const getGroupedMockVideosAsync = async (): Promise<VideoGroup[]> => {
  await initializeVideos();
  return getGroupedMockVideos();
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
  
  // Only generate interactions if we have videos
  if (mockVideos.length === 0) {
    return interactions;
  }
  
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

