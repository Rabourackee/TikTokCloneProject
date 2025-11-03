import { useState, useRef } from 'react';
import { Video } from '../types/video';
import './VideoUploadModal.css';

interface VideoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (videoData: Omit<Video, 'id' | 'createdAt' | 'feedOrder'>) => Promise<void>;
  editingVideo?: Video | null;
}

const VideoUploadModal = ({ isOpen, onClose, onSubmit, editingVideo }: VideoUploadModalProps) => {
  const [inputMethod, setInputMethod] = useState<'url' | 'file'>('url');
  const [videoUrl, setVideoUrl] = useState(editingVideo?.url || '');
  const [caption, setCaption] = useState(editingVideo?.caption || '');
  const [username, setUsername] = useState(editingVideo?.username || '');
  const [userAvatar, setUserAvatar] = useState(editingVideo?.userAvatar || 'https://i.pravatar.cc/150?img=8');
  const [likes, setLikes] = useState(editingVideo?.likes || 0);
  const [comments, setComments] = useState(editingVideo?.comments || 0);
  const [shares, setShares] = useState(editingVideo?.shares || 0);
  const [isVisible, setIsVisible] = useState(editingVideo?.isVisible !== false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('video/')) {
        setError('Please select a valid video file');
        return;
      }
      
      // Create a local URL for the video file
      const localUrl = URL.createObjectURL(file);
      setVideoUrl(localUrl);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!videoUrl.trim()) {
      setError('Please provide a video URL or upload a file');
      return;
    }
    
    if (!caption.trim()) {
      setError('Please provide a caption');
      return;
    }
    
    if (!username.trim()) {
      setError('Please provide a username');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const videoData: Omit<Video, 'id' | 'createdAt' | 'feedOrder'> = {
        url: videoUrl,
        caption: caption.trim(),
        username: username.trim(),
        userAvatar,
        likes,
        comments,
        shares,
        isVisible,
      };
      
      await onSubmit(videoData);
      
      // Reset form
      if (!editingVideo) {
        setVideoUrl('');
        setCaption('');
        setUsername('');
        setLikes(0);
        setComments(0);
        setShares(0);
        setIsVisible(true);
      }
      
      onClose();
    } catch (err) {
      console.error('Error submitting video:', err);
      setError('Failed to save video. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editingVideo ? 'Edit Video' : 'Add New Video'}</h2>
          <button className="modal-close" onClick={handleClose} disabled={loading}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <label className="form-label">Video Source</label>
            <div className="input-method-toggle">
              <button
                type="button"
                className={`toggle-btn ${inputMethod === 'url' ? 'active' : ''}`}
                onClick={() => setInputMethod('url')}
              >
                🔗 URL
              </button>
              <button
                type="button"
                className={`toggle-btn ${inputMethod === 'file' ? 'active' : ''}`}
                onClick={() => setInputMethod('file')}
              >
                📁 Upload File
              </button>
            </div>

            {inputMethod === 'url' ? (
              <div className="form-group">
                <label htmlFor="video-url">Video URL</label>
                <input
                  id="video-url"
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://example.com/video.mp4"
                  required
                  disabled={loading}
                />
                <small className="form-hint">Enter a direct link to a video file (MP4, WebM, etc.)</small>
              </div>
            ) : (
              <div className="form-group">
                <label htmlFor="video-file">Video File</label>
                <div className="file-input-wrapper">
                  <input
                    ref={fileInputRef}
                    id="video-file"
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="file-select-btn"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={loading}
                  >
                    Choose Video File
                  </button>
                  {videoUrl && <span className="file-selected">✓ File selected</span>}
                </div>
                <small className="form-hint">
                  Select a video from your computer. Note: Local files will only work in this browser session.
                </small>
              </div>
            )}

            {videoUrl && (
              <div className="video-preview">
                <label>Preview</label>
                <video src={videoUrl} controls style={{ width: '100%', maxHeight: '200px' }} />
              </div>
            )}
          </div>

          <div className="form-section">
            <label className="form-label">Video Details</label>
            
            <div className="form-group">
              <label htmlFor="caption">Caption *</label>
              <textarea
                id="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write a caption for your video..."
                rows={3}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="username">Username *</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="creator_username"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="userAvatar">User Avatar URL</label>
              <input
                id="userAvatar"
                type="url"
                value={userAvatar}
                onChange={(e) => setUserAvatar(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-section">
            <label className="form-label">Engagement Metrics</label>
            
            <div className="metrics-grid">
              <div className="form-group">
                <label htmlFor="likes">Likes</label>
                <input
                  id="likes"
                  type="number"
                  value={likes}
                  onChange={(e) => setLikes(parseInt(e.target.value) || 0)}
                  min="0"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="comments">Comments</label>
                <input
                  id="comments"
                  type="number"
                  value={comments}
                  onChange={(e) => setComments(parseInt(e.target.value) || 0)}
                  min="0"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="shares">Shares</label>
                <input
                  id="shares"
                  type="number"
                  value={shares}
                  onChange={(e) => setShares(parseInt(e.target.value) || 0)}
                  min="0"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={isVisible}
                  onChange={(e) => setIsVisible(e.target.checked)}
                  disabled={loading}
                />
                <span>Visible in feed</span>
              </label>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : editingVideo ? 'Update Video' : 'Add Video'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VideoUploadModal;

