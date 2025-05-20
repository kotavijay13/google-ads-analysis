
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';
import { AlertCircle, Loader2 } from 'lucide-react';

const GoogleCallback = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const processCallback = async () => {
      if (!user) {
        navigate('/auth');
        return;
      }

      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const error = urlParams.get('error');
        const errorDescription = urlParams.get('error_description');
        const storedState = localStorage.getItem('googleSearchConsoleOAuthState');
        
        // Clear the state from localStorage
        localStorage.removeItem('googleSearchConsoleOAuthState');

        if (error) {
          throw new Error(`Google OAuth error: ${error}${errorDescription ? ` - ${errorDescription}` : ''}`);
        }

        if (!code) {
          throw new Error('No authorization code received');
        }

        if (state !== storedState) {
          throw new Error('OAuth state mismatch. This could be a security issue or you may have initiated the login flow multiple times.');
        }

        // Call our secure edge function to exchange the code for tokens
        console.log("Calling google-search-console-auth edge function with code");
        const { data, error: functionError } = await supabase.functions.invoke('google-search-console-auth', {
          body: { code, redirectUri: window.location.origin + '/google-callback' }
        });

        if (functionError || !data?.success) {
          console.error("Edge function error:", functionError, data);
          throw new Error(functionError?.message || data?.error || 'Failed to get Google access token');
        }

        toast.success('Successfully connected to Google Search Console');
        navigate('/integrations');
      } catch (error) {
        console.error('Google OAuth callback error:', error);
        const errorMsg = (error as Error).message || 'Failed to connect to Google Search Console';
        setErrorMessage(errorMsg);
        toast.error(errorMsg);
        
        // Still navigate after a short delay to show the error
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
              <p className="text-muted-foreground mt-2">Please wait while we connect your Google Search Console account...</p>
            </>
          ) : errorMessage ? (
            <>
              <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
              <h2 className="text-xl font-semibold mt-4 text-red-500">Authentication Failed</h2>
              <p className="text-muted-foreground mt-2">{errorMessage}</p>
              <p className="text-sm mt-4">Redirecting to integrations page...</p>
            </>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleCallback;
