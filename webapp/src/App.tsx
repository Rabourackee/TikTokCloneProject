import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import VideoFeed from './components/VideoFeed';
import AdminPanel from './components/AdminPanel';
import './App.css';

function AppContent() {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';

  return (
    <div className="app">
      <header className="app-header">
        <div className="logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 2v7.5L4 5v14l5-4.5V22l11-10L9 2z" />
          </svg>
          <span>TopTop</span>
        </div>
        
        <nav className="app-nav">
          <Link to="/" className={!isAdmin ? 'active' : ''}>
            Feed
          </Link>
          <Link to="/admin" className={isAdmin ? 'active' : ''}>
            Admin
          </Link>
        </nav>
      </header>
      
      <main className="app-content">
        <Routes>
          <Route path="/" element={<VideoFeed />} />
          <Route path="/admin" element={<AdminPanel />} />
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

