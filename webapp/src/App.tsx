import VideoFeed from './components/VideoFeed';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <div className="logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 2v7.5L4 5v14l5-4.5V22l11-10L9 2z" />
          </svg>
          <span>TopTop</span>
        </div>
      </header>
      <VideoFeed />
    </div>
  );
}

export default App;

