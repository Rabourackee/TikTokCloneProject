import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserContextType {
  username: string | null;
  sessionId: string;
  signIn: (username: string) => void;
  signOut: () => void;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string>(() => {
    const savedSessionId = localStorage.getItem('sessionId');
    return savedSessionId || generateSessionId();
  });

  useEffect(() => {
    // Load user from localStorage on mount
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
      setUsername(savedUsername);
    }

    // Save session ID
    localStorage.setItem('sessionId', sessionId);
  }, [sessionId]);

  const signIn = (newUsername: string) => {
    setUsername(newUsername);
    localStorage.setItem('username', newUsername);
    localStorage.setItem('signInTime', new Date().toISOString());
  };

  const signOut = () => {
    setUsername(null);
    localStorage.removeItem('username');
    localStorage.removeItem('signInTime');
    // Generate new session ID on sign out
    const newSessionId = generateSessionId();
    setSessionId(newSessionId);
    localStorage.setItem('sessionId', newSessionId);
  };

  return (
    <UserContext.Provider
      value={{
        username,
        sessionId,
        signIn,
        signOut,
        isAuthenticated: !!username,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

