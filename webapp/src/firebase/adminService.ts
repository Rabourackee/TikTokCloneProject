import { collection, query, getDocs, doc, updateDoc, writeBatch } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './config';
import { Video, VideoAnalytics, UserSession } from '../types/video';
import { 
  getMockVideos, 
  updateMockVideoVisibility, 
  batchUpdateMockVideoOrders,
  getAllMockVideoAnalytics,
  getMockVideoAnalytics,
  getMockUserSessions,
} from './mockDataStore';

const VIDEOS_COLLECTION = 'videos';

/**
 * Fetch ALL videos (including hidden ones) for admin view
 */
export const fetchAllVideos = async (): Promise<Video[]> => {
  if (!isFirebaseConfigured() || !db) {
    console.log('Firebase not configured, using mock videos');
    return getMockVideos();
  }

  try {
    const videosQuery = query(collection(db, VIDEOS_COLLECTION));
    const querySnapshot = await getDocs(videosQuery);
    const videos: Video[] = [];

    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      videos.push({
        id: docSnapshot.id,
        url: data.url || data.videoUrl || '',
        caption: data.caption || data.description || '',
        likes: data.likes || 0,
        comments: data.comments || 0,
        shares: data.shares || 0,
        username: data.username || data.author || 'Unknown',
        userAvatar: data.userAvatar || data.avatarUrl || '',
        createdAt: data.createdAt?.toDate() || new Date(),
        isVisible: data.isVisible !== undefined ? data.isVisible : true,
        feedOrder: data.feedOrder !== undefined ? data.feedOrder : 0,
      });
    });

    // Sort by feedOrder
    return videos.sort((a, b) => (a.feedOrder || 0) - (b.feedOrder || 0));
  } catch (error) {
    console.error('Error fetching all videos:', error);
    return getMockVideos();
  }
};

/**
 * Update video visibility
 */
export const updateVideoVisibility = async (videoId: string, isVisible: boolean): Promise<void> => {
  if (!isFirebaseConfigured() || !db) {
    console.log('Firebase not configured, updating visibility in mock data');
    updateMockVideoVisibility(videoId, isVisible);
    return Promise.resolve();
  }
  
  const videoRef = doc(db, VIDEOS_COLLECTION, videoId);
  await updateDoc(videoRef, { isVisible });
};

/**
 * Update video order
 */
export const updateVideoOrder = async (videoId: string, feedOrder: number): Promise<void> => {
  if (!isFirebaseConfigured() || !db) {
    console.log('Firebase not configured, simulating order update in mock data');
    // In mock mode, just resolve successfully (order is already updated in UI state)
    return Promise.resolve();
  }
  
  const videoRef = doc(db, VIDEOS_COLLECTION, videoId);
  await updateDoc(videoRef, { feedOrder });
};

/**
 * Batch update video orders (efficient for drag-and-drop reordering)
 */
export const batchUpdateVideoOrders = async (videos: Array<{ id: string; feedOrder: number }>): Promise<void> => {
  if (!isFirebaseConfigured() || !db) {
    console.log('Firebase not configured, updating order in mock data');
    batchUpdateMockVideoOrders(videos);
    return Promise.resolve();
  }
  
  const batch = writeBatch(db);
  
  videos.forEach(({ id, feedOrder }) => {
    const videoRef = doc(db, VIDEOS_COLLECTION, id);
    batch.update(videoRef, { feedOrder });
  });
  
  await batch.commit();
};

/**
 * Get analytics for all videos
 */
export const fetchAllVideoAnalytics = async (): Promise<VideoAnalytics[]> => {
  if (!isFirebaseConfigured() || !db) {
    console.log('Firebase not configured, using mock analytics');
    return getAllMockVideoAnalytics();
  }

  try {
    // In a real Firebase implementation, you would:
    // 1. Query the 'interactions' collection
    // 2. Aggregate the data per video
    // 3. Calculate analytics metrics
    // For now, return mock data
    return getAllMockVideoAnalytics();
  } catch (error) {
    console.error('Error fetching video analytics:', error);
    return getAllMockVideoAnalytics();
  }
};

/**
 * Get analytics for a specific video
 */
export const fetchVideoAnalytics = async (videoId: string): Promise<VideoAnalytics> => {
  if (!isFirebaseConfigured() || !db) {
    console.log('Firebase not configured, using mock analytics');
    return getMockVideoAnalytics(videoId);
  }

  try {
    // In a real Firebase implementation, you would query interactions for this video
    return getMockVideoAnalytics(videoId);
  } catch (error) {
    console.error('Error fetching video analytics:', error);
    return getMockVideoAnalytics(videoId);
  }
};

/**
 * Get all user sessions
 */
export const fetchUserSessions = async (): Promise<UserSession[]> => {
  if (!isFirebaseConfigured() || !db) {
    console.log('Firebase not configured, using mock sessions');
    return getMockUserSessions();
  }

  try {
    // In a real Firebase implementation, you would:
    // 1. Query the 'sessions' or 'interactions' collection
    // 2. Group by sessionId
    // 3. Calculate session metrics
    return getMockUserSessions();
  } catch (error) {
    console.error('Error fetching user sessions:', error);
    return getMockUserSessions();
  }
};



