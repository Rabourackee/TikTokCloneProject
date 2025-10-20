import { UserInteractionEvent, AnalyticsSummary } from '../types/video';

const STORAGE_KEY = 'toptop_analytics_data';

// Get device information
const getDeviceInfo = () => {
  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
  };
};

// Generate unique ID for each interaction
const generateId = (): string => {
  return `interaction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Get all stored interactions from localStorage
export const getAllInteractions = (): UserInteractionEvent[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error reading analytics data:', error);
    return [];
  }
};

// Save interactions to localStorage
const saveInteractions = (interactions: UserInteractionEvent[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(interactions));
  } catch (error) {
    console.error('Error saving analytics data:', error);
  }
};

// Track a user interaction
export const trackInteraction = (
  username: string,
  sessionId: string,
  videoId: string,
  videoCaption: string,
  interactionType: UserInteractionEvent['interactionType'],
  watchDuration?: number
): void => {
  const interaction: UserInteractionEvent = {
    id: generateId(),
    username,
    sessionId,
    videoId,
    videoCaption,
    interactionType,
    timestamp: new Date().toISOString(),
    watchDuration,
    deviceInfo: getDeviceInfo(),
  };

  const interactions = getAllInteractions();
  interactions.push(interaction);
  saveInteractions(interactions);

  console.log('Interaction tracked:', interaction);
};

// Get analytics summary
export const getAnalyticsSummary = (): AnalyticsSummary => {
  const interactions = getAllInteractions();

  // Calculate basic metrics
  const views = interactions.filter(i => i.interactionType === 'view');
  const likes = interactions.filter(i => i.interactionType === 'like');
  const comments = interactions.filter(i => i.interactionType === 'comment');
  const shares = interactions.filter(i => i.interactionType === 'share');

  // Get unique users
  const uniqueUsers = new Set(interactions.map(i => i.username));

  // Calculate watch time
  const totalWatchTime = interactions
    .filter(i => i.watchDuration)
    .reduce((sum, i) => sum + (i.watchDuration || 0), 0);
  
  const averageWatchTime = views.length > 0 ? totalWatchTime / views.length : 0;

  // Top videos by views
  const videoStats = new Map<string, {
    videoId: string;
    caption: string;
    views: number;
    likes: number;
    comments: number;
    shares: number;
  }>();

  interactions.forEach(interaction => {
    const key = interaction.videoId;
    if (!videoStats.has(key)) {
      videoStats.set(key, {
        videoId: interaction.videoId,
        caption: interaction.videoCaption,
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0,
      });
    }

    const stats = videoStats.get(key)!;
    if (interaction.interactionType === 'view') stats.views++;
    if (interaction.interactionType === 'like') stats.likes++;
    if (interaction.interactionType === 'comment') stats.comments++;
    if (interaction.interactionType === 'share') stats.shares++;
  });

  const topVideos = Array.from(videoStats.values())
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  // User activity
  const userStats = new Map<string, {
    username: string;
    sessionId: string;
    interactions: number;
    videosWatched: Set<string>;
    totalWatchTime: number;
  }>();

  interactions.forEach(interaction => {
    const key = interaction.username;
    if (!userStats.has(key)) {
      userStats.set(key, {
        username: interaction.username,
        sessionId: interaction.sessionId,
        interactions: 0,
        videosWatched: new Set(),
        totalWatchTime: 0,
      });
    }

    const stats = userStats.get(key)!;
    stats.interactions++;
    if (interaction.interactionType === 'view') {
      stats.videosWatched.add(interaction.videoId);
    }
    if (interaction.watchDuration) {
      stats.totalWatchTime += interaction.watchDuration;
    }
  });

  const userActivity = Array.from(userStats.values()).map(stats => ({
    username: stats.username,
    sessionId: stats.sessionId,
    interactions: stats.interactions,
    videosWatched: stats.videosWatched.size,
    totalWatchTime: stats.totalWatchTime,
  }));

  return {
    totalViews: views.length,
    totalLikes: likes.length,
    totalComments: comments.length,
    totalShares: shares.length,
    totalUsers: uniqueUsers.size,
    totalWatchTime,
    averageWatchTime,
    topVideos,
    userActivity,
  };
};

// Export all data as JSON file
export const exportAnalyticsData = (): void => {
  const interactions = getAllInteractions();
  const summary = getAnalyticsSummary();
  
  const data = {
    summary,
    interactions,
    exportedAt: new Date().toISOString(),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `toptop-analytics-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Clear all analytics data
export const clearAnalyticsData = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

// Get interactions by user
export const getInteractionsByUser = (username: string): UserInteractionEvent[] => {
  const interactions = getAllInteractions();
  return interactions.filter(i => i.username === username);
};

// Get interactions by video
export const getInteractionsByVideo = (videoId: string): UserInteractionEvent[] => {
  const interactions = getAllInteractions();
  return interactions.filter(i => i.videoId === videoId);
};

