import { useEffect, useRef, useState } from 'react';
import { Video } from '../types/video';
import { useUser } from '../contexts/UserContext';
import { trackInteraction } from '../services/analyticsService';
import './VideoPlayer.css';

interface VideoPlayerProps {
  video: Video;
  isActive: boolean;
}

const VideoPlayer = ({ video, isActive }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasTrackedView, setHasTrackedView] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const watchStartTime = useRef<number | null>(null);
  const totalWatchTime = useRef<number>(0);
  
  const { username, sessionId } = useUser();

  // Auto-play/pause based on whether this video is in view
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (isActive) {
      // Track view when video becomes active (only once)
      if (!hasTrackedView && username) {
        trackInteraction(username, sessionId, video.id, video.caption, 'view');
        setHasTrackedView(true);
      }
      
      // Start watch timer
      watchStartTime.current = Date.now();
      
      videoElement.play()
        .then(() => {
          setIsPlaying(true);
          if (username) {
            trackInteraction(username, sessionId, video.id, video.caption, 'play');
          }
        })
        .catch(err => console.error('Error playing video:', err));
    } else {
      // Calculate and save watch duration
      if (watchStartTime.current !== null) {
        const duration = (Date.now() - watchStartTime.current) / 1000;
        totalWatchTime.current += duration;
        watchStartTime.current = null;
      }
      
      videoElement.pause();
      setIsPlaying(false);
      if (username) {
        trackInteraction(username, sessionId, video.id, video.caption, 'pause', totalWatchTime.current);
      }
    }
  }, [isActive, username, sessionId, video.id, video.caption, hasTrackedView]);
  
  // Track video completion
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    const handleEnded = () => {
      if (username) {
        const duration = totalWatchTime.current + (watchStartTime.current ? (Date.now() - watchStartTime.current) / 1000 : 0);
        trackInteraction(username, sessionId, video.id, video.caption, 'complete', duration);
      }
    };
    
    videoElement.addEventListener('ended', handleEnded);
    return () => videoElement.removeEventListener('ended', handleEnded);
  }, [username, sessionId, video.id, video.caption]);

  const handlePlayPause = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (isPlaying) {
      // Calculate watch duration when pausing
      if (watchStartTime.current !== null) {
        const duration = (Date.now() - watchStartTime.current) / 1000;
        totalWatchTime.current += duration;
        watchStartTime.current = null;
      }
      
      videoElement.pause();
      setIsPlaying(false);
      if (username) {
        trackInteraction(username, sessionId, video.id, video.caption, 'pause', totalWatchTime.current);
      }
    } else {
      watchStartTime.current = Date.now();
      videoElement.play();
      setIsPlaying(true);
      if (username) {
        trackInteraction(username, sessionId, video.id, video.caption, 'play');
      }
    }
  };

  const toggleMute = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    videoElement.muted = !videoElement.muted;
    setIsMuted(!isMuted);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="video-player">
      <video
        ref={videoRef}
        src={video.url}
        className="video-element"
        loop
        playsInline
        onClick={handlePlayPause}
      />
      
      {/* Play/Pause overlay */}
      {!isPlaying && (
        <div className="play-overlay" onClick={handlePlayPause}>
          <div className="play-button">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="40" r="40" fill="rgba(255,255,255,0.3)" />
              <path d="M30 20 L30 60 L60 40 Z" fill="white" />
            </svg>
          </div>
        </div>
      )}

      {/* Video Info Overlay */}
      <div className="video-info">
        <div className="user-info">
          <img src={video.userAvatar} alt={video.username} className="avatar" />
          <span className="username">@{video.username}</span>
        </div>
        <div className="caption">{video.caption}</div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button 
          className={`action-btn ${hasLiked ? 'liked' : ''}`}
          onClick={(e) => { 
            e.stopPropagation();
            if (username && !hasLiked) {
              trackInteraction(username, sessionId, video.id, video.caption, 'like');
              setHasLiked(true);
            }
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill={hasLiked ? "red" : "none"} stroke="white" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <span className="action-count">{formatNumber(video.likes + (hasLiked ? 1 : 0))}</span>
        </button>

        <button 
          className="action-btn"
          onClick={(e) => { 
            e.stopPropagation();
            if (username) {
              trackInteraction(username, sessionId, video.id, video.caption, 'comment');
            }
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span className="action-count">{formatNumber(video.comments)}</span>
        </button>

        <button 
          className="action-btn"
          onClick={(e) => { 
            e.stopPropagation();
            if (username) {
              trackInteraction(username, sessionId, video.id, video.caption, 'share');
            }
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          <span className="action-count">{formatNumber(video.shares)}</span>
        </button>

        <button className="action-btn mute-btn" onClick={toggleMute}>
          {isMuted ? (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;

