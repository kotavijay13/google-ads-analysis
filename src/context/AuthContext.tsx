
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
  const [initialized, setInitialized] = useState(false);
  
  useEffect(() => {
    let mounted = true;
    
    // Shorter timeout to prevent long loading states
    const loadingTimeout = setTimeout(() => {
      if (loading && mounted) {
        console.log('Auth loading timed out, forcing completion');
        setLoading(false);
      }
    }, 2000); // Reduced from 3 seconds to 2 seconds
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        if (!mounted) return;
        
        console.log('Auth state changed:', event, currentSession?.user?.email);
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          setLoading(false);
          setInitialized(true);
        } else if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          setLoading(false);
          setInitialized(true);
        } else if (event === 'INITIAL_SESSION') {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          setLoading(false);
          setInitialized(true);
        }
      }
    );
    
    // Initialize auth state
    const initializeAuth = async () => {
      if (!mounted) return;
      
      try {
        console.log('Initializing auth session...');
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (error) {
          console.error('Error fetching auth session:', error);
          setLoading(false);
          setInitialized(true);
          return;
        }
        
        console.log('Initial session check:', currentSession?.user?.email || 'No session');
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
        setInitialized(true);
      } catch (error) {
        if (!mounted) return;
        console.error('Error fetching auth session:', error);
        setLoading(false);
        setInitialized(true);
      }
    };

    // Only initialize if not already initialized
    if (!initialized) {
      initializeAuth();
    }
    
    return () => {
      mounted = false;
      clearTimeout(loadingTimeout);
      subscription.unsubscribe();
    };
  }, [initialized, loading]);

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      // Auth state listener will handle the state update
    } catch (error) {
      console.error('Error signing out:', error);
      setLoading(false);
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
