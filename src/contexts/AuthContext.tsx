
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  coins: number;
  lastRewardClaim?: Date;
  lastSpinTime?: Date;
  afkFarmStart?: Date;
  afkFarmCoinsEarned?: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserCoins: (amount: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem('spdm_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Mock authentication functions (to be replaced with Supabase)
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Mock API call
      const mockUser = {
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        username: email.split('@')[0],
        email,
        coins: 0,
      };
      
      setUser(mockUser);
      localStorage.setItem('spdm_user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, username: string, password: string) => {
    setLoading(true);
    try {
      // Mock API call
      const mockUser = {
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        username,
        email,
        coins: 0,
      };
      
      setUser(mockUser);
      localStorage.setItem('spdm_user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('spdm_user');
  };

  const updateUserCoins = (amount: number) => {
    if (user) {
      const updatedUser = {
        ...user,
        coins: user.coins + amount
      };
      setUser(updatedUser);
      localStorage.setItem('spdm_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      signup, 
      logout,
      updateUserCoins
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
