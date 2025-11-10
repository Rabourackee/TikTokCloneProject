import { collection, query, orderBy, limit, getDocs, QueryDocumentSnapshot } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './config';
import { Video, VideoGroup } from '../types/video';
import { getVisibleMockVideosAsync, getGroupedMockVideosAsync, groupVideosByUserAndCaption } from './mockDataStore';

const VIDEOS_COLLECTION = 'videos';

/**
 * Fetch videos from Firestore
 * @param limitCount - Number of videos to fetch
 * @returns Array of videos
 */
export const fetchVideos = async (limitCount: number = 20): Promise<Video[]> => {
  // Check if Firebase is configured
  if (!isFirebaseConfigured() || !db) {
    console.log('Firebase not configured, using mock videos from JSON');
    return await getVisibleMockVideosAsync();
  }

  try {
    const videosQuery = query(
      collection(db, VIDEOS_COLLECTION),
      orderBy('feedOrder', 'asc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(videosQuery);
    const videos: Video[] = [];

    querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
      const data = doc.data();
      // Only include visible videos
      if (data.isVisible !== false) {
        videos.push({
          id: doc.id,
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
      }
    });

    return videos;
  } catch (error) {
    console.error('Error fetching videos:', error);
    // Return mock data for development if Firebase is not configured
    return await getVisibleMockVideosAsync();
  }
};

/**
 * Fetch grouped videos (Sora-style) from Firestore or mock data
 * Videos with the same username and caption are grouped together for horizontal swiping
 * @param limitCount - Number of videos to fetch
 * @returns Array of video groups
 */
export const fetchGroupedVideos = async (limitCount: number = 20): Promise<VideoGroup[]> => {
  // Check if Firebase is configured
  if (!isFirebaseConfigured() || !db) {
    console.log('Firebase not configured, using mock grouped videos from JSON');
    return await getGroupedMockVideosAsync();
  }

  try {
    // Fetch videos first
    const videos = await fetchVideos(limitCount);
    
    // Group them by username and caption
    return groupVideosByUserAndCaption(videos);
  } catch (error) {
    console.error('Error fetching grouped videos:', error);
    // Return mock data for development if Firebase is not configured
    return await getGroupedMockVideosAsync();
  }
};


