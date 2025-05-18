
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  username: string;
  is_admin: boolean;
  is_owner: boolean;
}

interface Wallet {
  user_id: string;
  balance: number;
  last_reward_claim?: Date | string | null;
  total_wagered: number;
  total_games: number;
  level: number;
  updated_at: string;
}

interface AuthUser {
  id: string;
  email?: string;
  username: string;
  coins: number;
  isAdmin: boolean;
  isOwner: boolean;
  lastRewardClaim?: Date | null;
  lastSpinTime?: Date;
  afkFarmStart?: Date;
  afkFarmCoinsEarned?: number;
  level?: number;
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserCoins: (amount: number) => Promise<void>;
  updatePresence: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Function to fetch user profile and wallet data
  const fetchUserData = async (userId: string) => {
    try {
      // Fetch profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      // Fetch wallet data
      const { data: walletData, error: walletError } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (walletError) throw walletError;

      const profile = profileData as UserProfile;
      const wallet = walletData as Wallet;

      // Convert string date to Date object if needed
      const lastRewardClaim = wallet.last_reward_claim 
        ? new Date(wallet.last_reward_claim) 
        : null;

      // Combine data into user object
      const userData: AuthUser = {
        id: userId,
        username: profile.username,
        coins: wallet.balance,
        isAdmin: profile.is_admin,
        isOwner: profile.is_owner,
        lastRewardClaim: lastRewardClaim,
        level: wallet.level,
      };

      setUser(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Handle authentication state changes
  useEffect(() => {
    const setupAuth = async () => {
      // Set up auth state listener first
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, currentSession) => {
          setSession(currentSession);
          
          if (currentSession?.user) {
            // Use setTimeout to prevent potential deadlocks
            setTimeout(() => {
              fetchUserData(currentSession.user.id);
            }, 0);
          } else {
            setUser(null);
          }
        }
      );

      // Then check for existing session
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      
      if (data.session?.user) {
        await fetchUserData(data.session.user.id);
      }
      
      setLoading(false);
      
      return () => {
        subscription.unsubscribe();
      };
    };

    setupAuth();
  }, []);

  // Update user presence in active_users table
  const updatePresence = async () => {
    if (!user) return;

    try {
      // Using raw SQL RPC since the table isn't in TypeScript definitions yet
      const { error } = await supabase.rpc('update_user_presence', {
        user_id: user.id,
        status_value: 'online'
      });

      // Fallback if the RPC doesn't exist yet
      if (error) {
        // Direct upsert with custom query
        await supabase.from('active_users').upsert(
          {
            id: user.id,
            last_active: new Date().toISOString(),
            status: 'online'
          },
          { onConflict: 'id' }
        );
      }
    } catch (error) {
      console.error('Error updating user presence:', error);
    }
  };

  // Update presence periodically when user is logged in
  useEffect(() => {
    if (!user) return;

    updatePresence();
    const interval = setInterval(updatePresence, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [user]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast({
        title: "Login successful!",
        description: "Welcome back to SPDM!",
      });
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, username: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username
          }
        }
      });

      if (error) throw error;
      toast({
        title: "Account created!",
        description: "Welcome to SPDM!",
      });
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message || "Please check your information and try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const updateUserCoins = async (amount: number) => {
    if (!user) return;

    try {
      const { error } = await supabase.rpc('update_user_balance', {
        target_user_id: user.id,
        amount_change: amount
      });

      if (error) throw error;

      // Update local user state
      setUser(prev => prev ? {
        ...prev,
        coins: prev.coins + amount
      } : null);

    } catch (error) {
      console.error('Error updating user balance:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session,
      loading, 
      login, 
      signup, 
      logout,
      updateUserCoins,
      updatePresence
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
