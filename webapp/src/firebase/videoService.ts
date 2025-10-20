import { collection, query, orderBy, limit, getDocs, QueryDocumentSnapshot } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './config';
import { Video } from '../types/video';
import { getVisibleMockVideos } from './mockDataStore';

const VIDEOS_COLLECTION = 'videos';

/**
 * Fetch videos from Firestore
 * @param limitCount - Number of videos to fetch
 * @returns Array of videos
 */
export const fetchVideos = async (limitCount: number = 20): Promise<Video[]> => {
  // Check if Firebase is configured
  if (!isFirebaseConfigured() || !db) {
    console.log('Firebase not configured, using mock videos');
    return getVisibleMockVideos();
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
    return getVisibleMockVideos();
  }
};


