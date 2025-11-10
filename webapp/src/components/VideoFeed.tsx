import { useEffect, useState, useRef, useCallback } from 'react';
import VideoPlayer from './VideoPlayer';
import { VideoGroup } from '../types/video';
import { fetchGroupedVideos } from '../firebase/videoService';
import './VideoFeed.css';

const VideoFeed = () => {
  const [videoGroups, setVideoGroups] = useState<VideoGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);
  const [activeVideoInGroup, setActiveVideoInGroup] = useState<Map<number, number>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Fetch and group videos on mount
  useEffect(() => {
    const loadVideos = async () => {
      try {
        setLoading(true);
        // Fetch grouped videos (Sora-style)
        const groups = await fetchGroupedVideos();
        setVideoGroups(groups);
        
        // Initialize active video index for each group
        const initialActiveMap = new Map<number, number>();
        groups.forEach((_, index) => {
          initialActiveMap.set(index, 0); // Start at first video in each group
        });
        setActiveVideoInGroup(initialActiveMap);
        
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
          const groupIndex = Number(entry.target.getAttribute('data-group-index'));
          setActiveGroupIndex(groupIndex);
        }
      });
    }, options);

    // Observe all group containers
    const groupElements = document.querySelectorAll('.video-group-container');
    groupElements.forEach((element) => {
      observerRef.current?.observe(element);
    });
  }, []);

  useEffect(() => {
    if (videoGroups.length > 0) {
      setupObserver();
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [videoGroups, setupObserver]);

  // Handle horizontal scroll within a group
  const handleHorizontalScroll = (groupIndex: number, containerElement: HTMLElement) => {
    const scrollLeft = containerElement.scrollLeft;
    const containerWidth = containerElement.clientWidth;
    const videoIndex = Math.round(scrollLeft / containerWidth);
    
    setActiveVideoInGroup(prev => {
      const newMap = new Map(prev);
      newMap.set(groupIndex, videoIndex);
      return newMap;
    });
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const container = containerRef.current;
      if (!container) return;

      // Vertical navigation (between groups)
      if (e.key === 'ArrowDown' && activeGroupIndex < videoGroups.length - 1) {
        const nextGroup = document.querySelector(`[data-group-index="${activeGroupIndex + 1}"]`);
        nextGroup?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (e.key === 'ArrowUp' && activeGroupIndex > 0) {
        const prevGroup = document.querySelector(`[data-group-index="${activeGroupIndex - 1}"]`);
        prevGroup?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      // Horizontal navigation (within a group)
      else if (e.key === 'ArrowRight') {
        const currentGroup = videoGroups[activeGroupIndex];
        const currentVideoIndex = activeVideoInGroup.get(activeGroupIndex) || 0;
        if (currentGroup && currentVideoIndex < currentGroup.videos.length - 1) {
          const horizontalContainer = document.querySelector(
            `[data-group-index="${activeGroupIndex}"] .video-row-horizontal`
          ) as HTMLElement;
          if (horizontalContainer) {
            horizontalContainer.scrollBy({ left: window.innerWidth, behavior: 'smooth' });
          }
        }
      } else if (e.key === 'ArrowLeft') {
        const currentVideoIndex = activeVideoInGroup.get(activeGroupIndex) || 0;
        if (currentVideoIndex > 0) {
          const horizontalContainer = document.querySelector(
            `[data-group-index="${activeGroupIndex}"] .video-row-horizontal`
          ) as HTMLElement;
          if (horizontalContainer) {
            horizontalContainer.scrollBy({ left: -window.innerWidth, behavior: 'smooth' });
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeGroupIndex, activeVideoInGroup, videoGroups]);

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

  if (videoGroups.length === 0) {
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
      {videoGroups.map((group, groupIndex) => (
        <div
          key={group.id}
          className="video-group-container"
          data-group-index={groupIndex}
        >
          <div 
            className="video-row-horizontal"
            onScroll={(e) => handleHorizontalScroll(groupIndex, e.currentTarget)}
          >
            {group.videos.map((video, videoIndex) => (
              <div
                key={video.id}
                className="video-container"
                data-video-index={videoIndex}
              >
                <VideoPlayer
                  video={video}
                  isActive={
                    groupIndex === activeGroupIndex && 
                    videoIndex === (activeVideoInGroup.get(groupIndex) || 0)
                  }
                />
              </div>
            ))}
          </div>
          
          {/* Pagination dots for multiple videos in a group */}
          {group.videos.length > 1 && (
            <div className="video-pagination-dots">
              {group.videos.map((_, index) => (
                <div
                  key={index}
                  className={`pagination-dot ${
                    index === (activeVideoInGroup.get(groupIndex) || 0) ? 'active' : ''
                  }`}
                  onClick={() => {
                    const horizontalContainer = document.querySelector(
                      `[data-group-index="${groupIndex}"] .video-row-horizontal`
                    ) as HTMLElement;
                    if (horizontalContainer) {
                      horizontalContainer.scrollTo({
                        left: index * window.innerWidth,
                        behavior: 'smooth'
                      });
                    }
                  }}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default VideoFeed;

