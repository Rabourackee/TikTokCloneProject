import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Video, VideoAnalytics, UserSession } from '../types/video';
import { 
  fetchAllVideos, 
  updateVideoVisibility, 
  batchUpdateVideoOrders,
  fetchAllVideoAnalytics,
  fetchUserSessions,
  addVideo,
  updateVideo,
  deleteVideo
} from '../firebase/adminService';
import VideoUploadModal from './VideoUploadModal';
import './AdminPanel.css';

const AdminPanel = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'videos' | 'analytics' | 'sessions'>('videos');
  const [analytics, setAnalytics] = useState<VideoAnalytics[]>([]);
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);

  useEffect(() => {
    loadVideos();
    loadAnalytics();
    loadSessions();
  }, []);

  const loadVideos = async () => {
    try {
      setLoading(true);
      const fetchedVideos = await fetchAllVideos();
      setVideos(fetchedVideos);
      setError(null);
    } catch (err) {
      console.error('Failed to load videos:', err);
      setError('Failed to load videos. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      setAnalyticsLoading(true);
      const fetchedAnalytics = await fetchAllVideoAnalytics();
      setAnalytics(fetchedAnalytics);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const loadSessions = async () => {
    try {
      const fetchedSessions = await fetchUserSessions();
      setSessions(fetchedSessions);
    } catch (err) {
      console.error('Failed to load sessions:', err);
    }
  };

  const handleToggleVisibility = async (videoId: string, currentVisibility: boolean) => {
    try {
      await updateVideoVisibility(videoId, !currentVisibility);
      setVideos(videos.map(v => 
        v.id === videoId ? { ...v, isVisible: !currentVisibility } : v
      ));
    } catch (err) {
      console.error('Failed to update visibility:', err);
      alert('Failed to update visibility');
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(videos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update local state immediately for better UX
    setVideos(items);

    // Save to backend
    try {
      setSaving(true);
      const updates = items.map((video, index) => ({
        id: video.id,
        feedOrder: index,
      }));
      await batchUpdateVideoOrders(updates);
    } catch (err) {
      console.error('Failed to update order:', err);
      alert('Failed to save new order');
      // Reload videos to reset state
      loadVideos();
    } finally {
      setSaving(false);
    }
  };

  const handleAddVideo = () => {
    setEditingVideo(null);
    setIsModalOpen(true);
  };

  const handleEditVideo = (video: Video) => {
    setEditingVideo(video);
    setIsModalOpen(true);
  };

  const handleDeleteVideo = async (videoId: string) => {
    if (!confirm('Are you sure you want to delete this video?')) {
      return;
    }

    try {
      setSaving(true);
      await deleteVideo(videoId);
      setVideos(videos.filter(v => v.id !== videoId));
    } catch (err) {
      console.error('Failed to delete video:', err);
      alert('Failed to delete video');
    } finally {
      setSaving(false);
    }
  };

  const handleModalSubmit = async (videoData: Omit<Video, 'id' | 'createdAt' | 'feedOrder'>) => {
    try {
      setSaving(true);
      
      if (editingVideo) {
        // Update existing video
        await updateVideo(editingVideo.id, videoData);
        setVideos(videos.map(v => 
          v.id === editingVideo.id ? { ...v, ...videoData } : v
        ));
      } else {
        // Add new video
        const newVideo = await addVideo(videoData);
        setVideos([...videos, newVideo]);
      }
      
      setIsModalOpen(false);
      setEditingVideo(null);
    } catch (err) {
      console.error('Failed to save video:', err);
      throw err; // Let modal handle the error
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading videos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-error">
        <p>{error}</p>
        <button onClick={loadVideos}>Retry</button>
      </div>
    );
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Calculate overall stats
  const totalViews = analytics.reduce((sum, a) => sum + a.totalViews, 0);
  const totalUniqueViews = analytics.reduce((sum, a) => sum + a.uniqueViews, 0);
  const avgEngagement = analytics.length > 0 
    ? analytics.reduce((sum, a) => sum + a.engagementRate, 0) / analytics.length 
    : 0;

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-tabs">
          <button 
            className={`tab-button ${activeTab === 'videos' ? 'active' : ''}`}
            onClick={() => setActiveTab('videos')}
          >
            📹 Videos
          </button>
          <button 
            className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            📊 Analytics
          </button>
          <button 
            className={`tab-button ${activeTab === 'sessions' ? 'active' : ''}`}
            onClick={() => setActiveTab('sessions')}
          >
            👥 User Sessions
          </button>
        </div>
        {saving && <div className="saving-indicator">Saving...</div>}
      </div>

      {activeTab === 'videos' && (
        <>
          <div className="admin-stats">
            <span>Total: {videos.length}</span>
            <span>Visible: {videos.filter(v => v.isVisible).length}</span>
            <span>Hidden: {videos.filter(v => !v.isVisible).length}</span>
          </div>

          <div className="admin-toolbar">
            <div className="admin-instructions">
              <p>💡 Drag videos to reorder them in the feed. Toggle visibility with the eye icon.</p>
            </div>
            <button className="btn-add-video" onClick={handleAddVideo}>
              + Add Video
            </button>
          </div>
        </>
      )}

      {activeTab === 'videos' && (
        <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="videos">
          {(provided) => (
            <div
              className="video-list"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {videos.map((video, index) => (
                <Draggable key={video.id} draggableId={video.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`video-item ${snapshot.isDragging ? 'dragging' : ''} ${!video.isVisible ? 'hidden-video' : ''}`}
                    >
                      <div className="drag-handle">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M9 3h2v2H9V3zm4 0h2v2h-2V3zM9 7h2v2H9V7zm4 0h2v2h-2V7zm-4 4h2v2H9v-2zm4 0h2v2h-2v-2zm-4 4h2v2H9v-2zm4 0h2v2h-2v-2zm-4 4h2v2H9v-2zm4 0h2v2h-2v-2z" />
                        </svg>
                      </div>

                      <div className="video-order">#{index + 1}</div>

                      <div className="video-thumbnail">
                        <video src={video.url} />
                      </div>

                      <div className="video-info">
                        <div className="video-caption">{video.caption}</div>
                        <div className="video-meta">
                          <span>@{video.username}</span>
                          <span>❤️ {video.likes}</span>
                          <span>💬 {video.comments}</span>
                        </div>
                      </div>

                      <div className="video-actions">
                        <button
                          className="action-btn edit-btn"
                          onClick={() => handleEditVideo(video)}
                          title="Edit video"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>

                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleDeleteVideo(video.id)}
                          title="Delete video"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>

                        <button
                          className="action-btn visibility-toggle"
                          onClick={() => handleToggleVisibility(video.id, video.isVisible ?? true)}
                          title={video.isVisible ? 'Hide from feed' : 'Show in feed'}
                        >
                          {video.isVisible ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                              <line x1="1" y1="1" x2="23" y2="23" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      )}

      {activeTab === 'analytics' && (
        <div className="analytics-section">
          <div className="analytics-overview">
            <div className="analytics-card">
              <div className="analytics-value">{totalViews.toLocaleString()}</div>
              <div className="analytics-label">Total Views</div>
            </div>
            <div className="analytics-card">
              <div className="analytics-value">{totalUniqueViews.toLocaleString()}</div>
              <div className="analytics-label">Unique Views</div>
            </div>
            <div className="analytics-card">
              <div className="analytics-value">{avgEngagement.toFixed(1)}%</div>
              <div className="analytics-label">Avg Engagement</div>
            </div>
            <div className="analytics-card">
              <div className="analytics-value">{sessions.length}</div>
              <div className="analytics-label">Active Sessions</div>
            </div>
          </div>

          <h2>Video Performance</h2>
          {analyticsLoading ? (
            <div className="loading-message">Loading analytics...</div>
          ) : (
            <div className="analytics-list">
              {analytics.map((analytic) => {
                const video = videos.find(v => v.id === analytic.videoId);
                return (
                  <div key={analytic.videoId} className="analytics-item">
                    <div className="analytics-item-header">
                      <div className="video-thumbnail-small">
                        <video src={video?.url} />
                      </div>
                      <div className="video-info-small">
                        <div className="video-caption-small">{video?.caption}</div>
                        <div className="video-username-small">@{video?.username}</div>
                      </div>
                    </div>
                    
                    <div className="analytics-metrics">
                      <div className="metric">
                        <span className="metric-value">{analytic.totalViews}</span>
                        <span className="metric-label">Views</span>
                      </div>
                      <div className="metric">
                        <span className="metric-value">{analytic.uniqueViews}</span>
                        <span className="metric-label">Unique</span>
                      </div>
                      <div className="metric">
                        <span className="metric-value">{formatDuration(analytic.averageWatchTime)}</span>
                        <span className="metric-label">Avg Watch</span>
                      </div>
                      <div className="metric">
                        <span className="metric-value">{analytic.completionRate.toFixed(0)}%</span>
                        <span className="metric-label">Completion</span>
                      </div>
                      <div className="metric">
                        <span className="metric-value">{analytic.engagementRate.toFixed(1)}%</span>
                        <span className="metric-label">Engagement</span>
                      </div>
                    </div>

                    <div className="device-breakdown">
                      <span>📱 {analytic.deviceBreakdown.mobile}</span>
                      <span>💻 {analytic.deviceBreakdown.desktop}</span>
                      <span>📲 {analytic.deviceBreakdown.tablet}</span>
                    </div>

                    {analytic.topCountries.length > 0 && (
                      <div className="top-countries">
                        <strong>Top Countries:</strong>
                        {analytic.topCountries.map(c => (
                          <span key={c.country} className="country-badge">
                            {c.country} ({c.views})
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'sessions' && (
        <div className="sessions-section">
          <h2>User Sessions & Interaction Data</h2>
          <p className="section-description">
            Real-time user interaction data including device info, location, and behavior patterns
          </p>
          
          <div className="sessions-stats">
            <div className="stat-card">
              <div className="stat-value">{sessions.length}</div>
              <div className="stat-label">Total Sessions</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {formatDuration(sessions.reduce((sum, s) => sum + s.totalWatchTime, 0) / sessions.length || 0)}
              </div>
              <div className="stat-label">Avg Session Duration</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {(sessions.reduce((sum, s) => sum + s.videosWatched.length, 0) / sessions.length || 0).toFixed(1)}
              </div>
              <div className="stat-label">Avg Videos/Session</div>
            </div>
          </div>

          <div className="sessions-list">
            {sessions.slice(0, 50).map((session) => (
              <div key={session.sessionId} className="session-item">
                <div className="session-header">
                  <span className="session-id">Session: {session.sessionId}</span>
                  <span className="session-time">{formatDate(session.lastActivity)}</span>
                </div>
                
                <div className="session-details">
                  <div className="detail-group">
                    <strong>🖥️ Device Info:</strong>
                    <div className="detail-content">
                      <div>Platform: {session.deviceInfo.platform}</div>
                      <div>Language: {session.deviceInfo.language}</div>
                      <div>Screen: {session.deviceInfo.screenResolution}</div>
                      <div className="user-agent">UA: {session.deviceInfo.userAgent}</div>
                    </div>
                  </div>

                  {session.location && (
                    <div className="detail-group">
                      <strong>🌍 Location:</strong>
                      <div className="detail-content">
                        <div>{session.location.city}, {session.location.country}</div>
                        <div>Timezone: {session.location.timezone}</div>
                      </div>
                    </div>
                  )}

                  <div className="detail-group">
                    <strong>📊 Activity:</strong>
                    <div className="detail-content">
                      <div>Videos Watched: {session.videosWatched.length}</div>
                      <div>Total Watch Time: {formatDuration(session.totalWatchTime)}</div>
                      <div>Total Interactions: {session.interactions}</div>
                      <div>Session Duration: {formatDuration((session.lastActivity.getTime() - session.startTime.getTime()) / 1000)}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <VideoUploadModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingVideo(null);
        }}
        onSubmit={handleModalSubmit}
        editingVideo={editingVideo}
      />
    </div>
  );
};

export default AdminPanel;

