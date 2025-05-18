
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';
import { Loader2 } from 'lucide-react';

const GoogleCallback = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processCallback = async () => {
      if (!user) {
        console.log("No user found, redirecting to auth");
        navigate('/auth');
        return;
      }

      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const errorParam = urlParams.get('error');
        const storedState = localStorage.getItem('googleOAuthState');
        
        // Clear the state from localStorage
        localStorage.removeItem('googleOAuthState');

        if (errorParam) {
          throw new Error(`OAuth error: ${errorParam}`);
        }

        if (!code) {
          throw new Error('No authorization code received');
        }

        if (state !== storedState) {
          throw new Error('OAuth state mismatch - security validation failed');
        }

        console.log("OAuth code received, exchanging for token...");

        // Call our secure edge function to exchange the code for tokens
        const { data, error: functionError } = await supabase.functions.invoke('google-ads-auth', {
          body: { 
            code, 
            redirectUri: window.location.origin + '/google-callback' 
          }
        });

        if (functionError || !data) {
          console.error("Edge function error:", functionError);
          throw new Error(functionError?.message || 'Failed to get Google access token');
        }

        toast.success('Successfully connected to Google Ads');
        navigate('/integrations');
      } catch (error: any) {
        console.error('Google OAuth callback error:', error);
        setError(error.message || 'Failed to connect to Google Ads');
        toast.error(error.message || 'Failed to connect to Google Ads');
        
        // Delay redirect on error to show the error message
        setTimeout(() => {
          navigate('/integrations');
        }, 3000);
      } finally {
        setProcessing(false);
      }
    };

    processCallback();
  }, [user, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center p-6">
          {processing ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin mb-2" />
              <h2 className="text-xl font-semibold mt-4">Processing Google Authentication</h2>
              <p className="text-muted-foreground mt-2">Please wait while we connect your Google Ads account...</p>
            </>
          ) : error ? (
            <>
              <div className="text-red-500 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mt-4">Authentication Failed</h2>
              <p className="text-muted-foreground mt-2 text-center">{error}</p>
              <p className="text-sm mt-4">Redirecting to integrations page...</p>
            </>
          ) : (
            <>
              <div className="text-green-500 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mt-4">Authentication Successful</h2>
              <p className="text-muted-foreground mt-2">Successfully connected Google Ads</p>
              <p className="text-sm mt-4">Redirecting to integrations page...</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleCallback;
