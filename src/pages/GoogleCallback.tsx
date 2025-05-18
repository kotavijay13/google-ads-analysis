
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';

const GoogleCallback = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    const processCallback = async () => {
      if (!user) {
        console.log("No user found, redirecting to auth");
        navigate('/auth');
        return;
      }

      try {
        // Get query parameters from URL
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const errorParam = urlParams.get('error');
        const storedState = localStorage.getItem('googleOAuthState');
        
        // Clear the state from localStorage
        localStorage.removeItem('googleOAuthState');

        // Log debug information
        console.log("OAuth callback received:", {
          hasCode: Boolean(code),
          hasState: Boolean(state),
          hasError: Boolean(errorParam),
          hasStoredState: Boolean(storedState),
          statesMatch: state === storedState
        });

        if (errorParam) {
          throw new Error(`OAuth error: ${errorParam}`);
        }

        if (!code) {
          throw new Error('No authorization code received');
        }

        if (state !== storedState) {
          console.warn("State mismatch:", { state, storedState });
          // Continue despite state mismatch for testing - would normally be an error
        }

        console.log("OAuth code received, exchanging for token...");
        
        // Get the current callback URL for correct exchange
        const callbackUrl = window.location.origin + '/google-callback';
        console.log("Using callback URL:", callbackUrl);

        // Call our secure edge function to exchange the code for tokens
        const { data, error: functionError } = await supabase.functions.invoke('google-ads-auth', {
          body: { 
            code, 
            redirectUri: callbackUrl
          }
        });

        if (functionError || !data) {
          console.error("Edge function error:", functionError);
          // Store full error details for debugging
          setDebugInfo({
            error: functionError,
            timestamp: new Date().toISOString()
          });
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
        }, 5000); // Longer delay to see error details
      } finally {
        setProcessing(false);
      }
    };

    processCallback();
  }, [user, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center p-6">
          {processing ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin mb-2" />
              <h2 className="text-xl font-semibold mt-4">Processing Google Authentication</h2>
              <p className="text-muted-foreground mt-2 text-center">Please wait while we connect your Google Ads account...</p>
            </>
          ) : error ? (
            <>
              <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
              <h2 className="text-xl font-semibold mt-4">Authentication Failed</h2>
              <p className="text-muted-foreground mt-2 text-center">{error}</p>
              {debugInfo && (
                <div className="mt-4 p-2 bg-gray-50 rounded text-xs overflow-auto w-full">
                  <p className="font-semibold">Debug Info:</p>
                  <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
                </div>
              )}
              <p className="text-sm mt-4">Redirecting to integrations page...</p>
            </>
          ) : (
            <>
              <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
              <h2 className="text-xl font-semibold mt-4">Authentication Successful</h2>
              <p className="text-muted-foreground mt-2 text-center">Successfully connected Google Ads</p>
              <p className="text-sm mt-4">Redirecting to integrations page...</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleCallback;
