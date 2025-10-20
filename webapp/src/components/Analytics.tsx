import { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { 
  getAnalyticsSummary, 
  getAllInteractions, 
  exportAnalyticsData,
  clearAnalyticsData 
} from '../services/analyticsService';
import { AnalyticsSummary, UserInteractionEvent } from '../types/video';
import './Analytics.css';

const Analytics = () => {
  const { username, signOut } = useUser();
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [recentInteractions, setRecentInteractions] = useState<UserInteractionEvent[]>([]);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'videos' | 'users' | 'interactions'>('overview');

  const loadData = () => {
    const analyticsData = getAnalyticsSummary();
    setSummary(analyticsData);
    
    const allInteractions = getAllInteractions();
    // Get the 50 most recent interactions
    setRecentInteractions(allInteractions.slice(-50).reverse());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleExport = () => {
    exportAnalyticsData();
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all analytics data? This cannot be undone.')) {
      clearAnalyticsData();
      loadData();
    }
  };

  const formatDuration = (seconds: number): string => {
    if (seconds < 60) {
      return `${Math.round(seconds)}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${minutes}m ${secs}s`;
  };

  const formatDateTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  if (!summary) {
    return (
      <div className="analytics-loading">
        <div className="spinner"></div>
        <p>Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="analytics-container">
      <header className="analytics-header">
        <div className="header-top">
          <h1>Analytics Dashboard</h1>
          <div className="header-actions">
            <span className="current-user">Signed in as: <strong>{username}</strong></span>
            <button onClick={signOut} className="btn-signout">Sign Out</button>
          </div>
        </div>
        
        <div className="analytics-tabs">
          <button 
            className={selectedTab === 'overview' ? 'active' : ''} 
            onClick={() => setSelectedTab('overview')}
          >
            Overview
          </button>
          <button 
            className={selectedTab === 'videos' ? 'active' : ''} 
            onClick={() => setSelectedTab('videos')}
          >
            Top Videos
          </button>
          <button 
            className={selectedTab === 'users' ? 'active' : ''} 
            onClick={() => setSelectedTab('users')}
          >
            User Activity
          </button>
          <button 
            className={selectedTab === 'interactions' ? 'active' : ''} 
            onClick={() => setSelectedTab('interactions')}
          >
            Recent Interactions
          </button>
        </div>
      </header>

      <div className="analytics-content">
        {selectedTab === 'overview' && (
          <div className="overview-tab">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon views">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                <div className="stat-info">
                  <h3>Total Views</h3>
                  <p className="stat-value">{summary.totalViews.toLocaleString()}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon likes">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </div>
                <div className="stat-info">
                  <h3>Total Likes</h3>
                  <p className="stat-value">{summary.totalLikes.toLocaleString()}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon comments">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <div className="stat-info">
                  <h3>Total Comments</h3>
                  <p className="stat-value">{summary.totalComments.toLocaleString()}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon shares">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                </div>
                <div className="stat-info">
                  <h3>Total Shares</h3>
                  <p className="stat-value">{summary.totalShares.toLocaleString()}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon users">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div className="stat-info">
                  <h3>Total Users</h3>
                  <p className="stat-value">{summary.totalUsers.toLocaleString()}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon watch-time">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div className="stat-info">
                  <h3>Total Watch Time</h3>
                  <p className="stat-value">{formatDuration(summary.totalWatchTime)}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon avg-watch">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div className="stat-info">
                  <h3>Avg Watch Time</h3>
                  <p className="stat-value">{formatDuration(summary.averageWatchTime)}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon total">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <div className="stat-info">
                  <h3>Total Interactions</h3>
                  <p className="stat-value">
                    {(summary.totalViews + summary.totalLikes + summary.totalComments + summary.totalShares).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="data-actions">
              <button onClick={handleExport} className="btn-export">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Export Data
              </button>
              <button onClick={handleClear} className="btn-clear">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                Clear All Data
              </button>
            </div>
          </div>
        )}

        {selectedTab === 'videos' && (
          <div className="videos-tab">
            <h2>Top Videos by Views</h2>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Video Caption</th>
                    <th>Views</th>
                    <th>Likes</th>
                    <th>Comments</th>
                    <th>Shares</th>
                    <th>Engagement</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.topVideos.map((video, index) => (
                    <tr key={video.videoId}>
                      <td className="rank">#{index + 1}</td>
                      <td className="caption">{video.caption}</td>
                      <td>{video.views.toLocaleString()}</td>
                      <td>{video.likes.toLocaleString()}</td>
                      <td>{video.comments.toLocaleString()}</td>
                      <td>{video.shares.toLocaleString()}</td>
                      <td>
                        {video.views > 0 
                          ? ((video.likes + video.comments + video.shares) / video.views * 100).toFixed(1) + '%'
                          : '0%'
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedTab === 'users' && (
          <div className="users-tab">
            <h2>User Activity</h2>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Session ID</th>
                    <th>Total Interactions</th>
                    <th>Videos Watched</th>
                    <th>Watch Time</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.userActivity.map((user) => (
                    <tr key={user.sessionId}>
                      <td className="username">{user.username}</td>
                      <td className="session-id">{user.sessionId}</td>
                      <td>{user.interactions.toLocaleString()}</td>
                      <td>{user.videosWatched.toLocaleString()}</td>
                      <td>{formatDuration(user.totalWatchTime)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedTab === 'interactions' && (
          <div className="interactions-tab">
            <h2>Recent Interactions</h2>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>User</th>
                    <th>Action</th>
                    <th>Video</th>
                    <th>Duration</th>
                    <th>Device</th>
                  </tr>
                </thead>
                <tbody>
                  {recentInteractions.map((interaction) => (
                    <tr key={interaction.id}>
                      <td className="timestamp">{formatDateTime(interaction.timestamp)}</td>
                      <td className="username">{interaction.username}</td>
                      <td>
                        <span className={`badge badge-${interaction.interactionType}`}>
                          {interaction.interactionType}
                        </span>
                      </td>
                      <td className="caption">{interaction.videoCaption}</td>
                      <td>
                        {interaction.watchDuration 
                          ? formatDuration(interaction.watchDuration) 
                          : '-'
                        }
                      </td>
                      <td className="device">{interaction.deviceInfo.platform}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;

