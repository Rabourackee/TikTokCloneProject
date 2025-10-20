import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import './SignIn.css';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signIn } = useUser();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    const trimmedUsername = username.trim();
    
    if (!trimmedUsername) {
      setError('Please enter your name');
      return;
    }
    
    if (trimmedUsername.length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }
    
    if (trimmedUsername.length > 50) {
      setError('Name must be less than 50 characters');
      return;
    }
    
    signIn(trimmedUsername);
    navigate('/');
  };

  return (
    <div className="signin-container">
      <div className="signin-box">
        <div className="signin-logo">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 2v7.5L4 5v14l5-4.5V22l11-10L9 2z" />
          </svg>
          <h1>TopTop</h1>
        </div>
        
        <div className="signin-content">
          <h2>Welcome!</h2>
          <p>Enter your name to start watching videos</p>
          
          <form onSubmit={handleSubmit} className="signin-form">
            <div className="form-group">
              <label htmlFor="username">Your Name</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                placeholder="Enter your name"
                className={error ? 'error' : ''}
                autoFocus
              />
              {error && <span className="error-message">{error}</span>}
            </div>
            
            <button type="submit" className="signin-button">
              Continue
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </form>
        </div>
        
        <div className="signin-footer">
          <p>By continuing, you agree to our data collection for analytics purposes</p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

