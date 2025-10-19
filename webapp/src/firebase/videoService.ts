import { collection, query, orderBy, limit, getDocs, QueryDocumentSnapshot } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './config';
import { Video } from '../types/video';

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
    return getMockVideos();
  }

  try {
    const videosQuery = query(
      collection(db, VIDEOS_COLLECTION),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(videosQuery);
    const videos: Video[] = [];

    querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
      const data = doc.data();
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
      });
    });

    return videos;
  } catch (error) {
    console.error('Error fetching videos:', error);
    // Return mock data for development if Firebase is not configured
    return getMockVideos();
  }
};

/**
 * Mock videos for development/testing
 */
const getMockVideos = (): Video[] => {
  return [
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
    },
  ];
};

