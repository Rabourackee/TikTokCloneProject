import { useEffect, useState, useRef, useCallback } from 'react';
import VideoPlayer from './VideoPlayer';
import { Video } from '../types/video';
import { fetchVideos } from '../firebase/videoService';
import './VideoFeed.css';

const VideoFeed = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Fetch videos on mount
  useEffect(() => {
    const loadVideos = async () => {
      try {
        setLoading(true);
        const fetchedVideos = await fetchVideos();
        setVideos(fetchedVideos);
        setError(null);
      } catch (err) {
        console.error('Failed to load videos:', err);
        setError('Failed to load videos. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, []);

  // Setup intersection observer for auto-play
  const setupObserver = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.75, // Video must be 75% visible
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const videoIndex = Number(entry.target.getAttribute('data-index'));
          setActiveVideoIndex(videoIndex);
        }
      });
    }, options);

    // Observe all video elements
    const videoElements = document.querySelectorAll('.video-container');
    videoElements.forEach((element) => {
      observerRef.current?.observe(element);
    });
  }, []);

  useEffect(() => {
    if (videos.length > 0) {
      setupObserver();
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [videos, setupObserver]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const container = containerRef.current;
      if (!container) return;

      if (e.key === 'ArrowDown' && activeVideoIndex < videos.length - 1) {
        const nextVideo = document.querySelector(`[data-index="${activeVideoIndex + 1}"]`);
        nextVideo?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (e.key === 'ArrowUp' && activeVideoIndex > 0) {
        const prevVideo = document.querySelector(`[data-index="${activeVideoIndex - 1}"]`);
        prevVideo?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeVideoIndex, videos.length]);

  if (loading) {
    return (
      <div className="feed-loading">
        <div className="spinner"></div>
        <p>Loading videos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="feed-error">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="feed-empty">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
          <line x1="7" y1="2" x2="7" y2="22" />
          <line x1="17" y1="2" x2="17" y2="22" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <line x1="2" y1="7" x2="7" y2="7" />
          <line x1="2" y1="17" x2="7" y2="17" />
          <line x1="17" y1="17" x2="22" y2="17" />
          <line x1="17" y1="7" x2="22" y2="7" />
        </svg>
        <p>No videos available</p>
      </div>
    );
  }

  return (
    <div className="video-feed" ref={containerRef}>
      {videos.map((video, index) => (
        <div
          key={video.id}
          className="video-container"
          data-index={index}
        >
          <VideoPlayer
            video={video}
            isActive={index === activeVideoIndex}
          />
        </div>
      ))}
    </div>
  );
};

export default VideoFeed;

