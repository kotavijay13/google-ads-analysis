
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
    // First check for existing session
    const initializeAuth = async () => {
      // Set loading to true before checking the session
      setLoading(true);
      
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        // Only update state if the session has changed
        if (JSON.stringify(currentSession) !== JSON.stringify(session)) {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
        }
      } catch (error) {
        console.error('Error fetching auth session:', error);
      } finally {
        // Always set loading to false when done
        setLoading(false);
      }
    };

    // Run the initialization
    initializeAuth();
    
    // Then set up listener for future changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        // Only update if the session has changed
        if (JSON.stringify(currentSession) !== JSON.stringify(session)) {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
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
