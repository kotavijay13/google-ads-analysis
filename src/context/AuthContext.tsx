
import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextProps {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  session: null,
  user: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Optimization: Add a timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      if (loading) {
        console.log('Auth loading timed out, forcing completion');
        setLoading(false);
      }
    }, 3000); // 3 seconds max loading time
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth state changed:', event, currentSession?.user?.email);
        
        if (event === 'SIGNED_IN') {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          setLoading(false);
        } else if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          setLoading(false);
        }
      }
    );
    
    // Initialize auth state
    const initializeAuth = async () => {
      try {
        console.log('Initializing auth session...');
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log('Initial session check:', currentSession?.user?.email || 'No session');
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
      } catch (error) {
        console.error('Error fetching auth session:', error);
      } finally {
        setLoading(false);
      }
    };

    // Run the initialization
    initializeAuth();
    
    return () => {
      clearTimeout(loadingTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      // Auth state listener will handle the state update
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const value = {
    session,
    user,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
