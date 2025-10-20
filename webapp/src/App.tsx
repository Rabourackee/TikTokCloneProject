import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { useUser } from './contexts/UserContext';
import VideoFeed from './components/VideoFeed';
import AdminPanel from './components/AdminPanel';
import SignIn from './components/SignIn';
import Analytics from './components/Analytics';
import './App.css';

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useUser();
  return isAuthenticated ? <>{children}</> : <Navigate to="/signin" replace />;
}

function AppContent() {
  const location = useLocation();
  const { isAuthenticated } = useUser();
  const isAdmin = location.pathname === '/admin';
  const isAnalytics = location.pathname === '/analytics';
  const isFeed = location.pathname === '/';
  
  // Don't show header on sign-in page or analytics page
  const showHeader = isAuthenticated && location.pathname !== '/signin' && location.pathname !== '/analytics';

  return (
    <div className="app">
      {showHeader && (
        <header className="app-header">
          <div className="logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 2v7.5L4 5v14l5-4.5V22l11-10L9 2z" />
            </svg>
            <span>TopTop</span>
          </div>
          
          <nav className="app-nav">
            <Link to="/" className={isFeed ? 'active' : ''}>
              Feed
            </Link>
            <Link to="/admin" className={isAdmin ? 'active' : ''}>
              Admin
            </Link>
            <Link to="/analytics" className={isAnalytics ? 'active' : ''}>
              Analytics
            </Link>
          </nav>
        </header>
      )}
      
      <main className="app-content">
        <Routes>
          <Route path="/signin" element={
            isAuthenticated ? <Navigate to="/" replace /> : <SignIn />
          } />
          <Route path="/" element={
            <ProtectedRoute>
              <VideoFeed />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          } />
          <Route path="/analytics" element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

