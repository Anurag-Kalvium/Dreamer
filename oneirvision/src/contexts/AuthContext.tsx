import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Mock API call for login
const mockLogin = async (email: string, password: string): Promise<User> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real app, this would be an actual API call to your backend
  if (email && password) {
    return {
      id: `user-${Math.random().toString(36).substr(2, 9)}`,
      name: email.split('@')[0],
      email,
      picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=random`,
      createdAt: new Date().toISOString()
    };
  }
  throw new Error('Invalid email or password');
};

// Mock API call for signup
const mockSignup = async (email: string, password: string, name: string): Promise<User> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real app, this would be an actual API call to your backend
  if (email && password && name) {
    return {
      id: `user-${Math.random().toString(36).substr(2, 9)}`,
      name,
      email,
      picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
      createdAt: new Date().toISOString()
    };
  }
  throw new Error('Please fill in all fields');
};

// Mock API call for Google login
const mockGoogleLogin = async (credential: string): Promise<User> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  try {
    // In a real app, you would verify the credential with your backend
    const decoded = JSON.parse(atob(credential.split('.')[1]));
    
    return {
      id: `google-${decoded.sub}`,
      name: decoded.name || decoded.email.split('@')[0],
      email: decoded.email,
      picture: decoded.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(decoded.name || decoded.email.split('@')[0])}&background=random`,
      createdAt: new Date().toISOString()
    };
  } catch (err) {
    throw new Error('Invalid Google credential');
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('oneirvision_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user data', e);
        localStorage.removeItem('oneirvision_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const userData = await mockLogin(email, password);
      setUser(userData);
      localStorage.setItem('oneirvision_user', JSON.stringify(userData));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (credential: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const userData = await mockGoogleLogin(credential);
      setUser(userData);
      localStorage.setItem('oneirvision_user', JSON.stringify(userData));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login with Google');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const userData = await mockSignup(email, password, name);
      setUser(userData);
      localStorage.setItem('oneirvision_user', JSON.stringify(userData));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem('oneirvision_user');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    loginWithGoogle,
    signup,
    logout,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
