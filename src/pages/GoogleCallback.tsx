
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';
import { AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GoogleCallback = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [authType, setAuthType] = useState<'search-console' | 'ads'>('search-console');

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
        
        // Determine which type of auth this is based on stored state
        const googleAdsState = localStorage.getItem('googleOAuthState');
        const searchConsoleState = localStorage.getItem('googleSearchConsoleOAuthState');
        
        let currentAuthType: 'search-console' | 'ads' = 'search-console';
        let storedState: string | null = null;
        
        if (state === googleAdsState) {
          currentAuthType = 'ads';
          storedState = googleAdsState;
          localStorage.removeItem('googleOAuthState');
        } else if (state === searchConsoleState) {
          currentAuthType = 'search-console';
          storedState = searchConsoleState;
          localStorage.removeItem('googleSearchConsoleOAuthState');
        }
        
        setAuthType(currentAuthType);

        if (error) {
          console.error('Google OAuth error:', error, errorDescription);
          throw new Error(`Google OAuth error: ${error}${errorDescription ? ` - ${errorDescription}` : ''}`);
        }

        if (!code) {
          throw new Error('No authorization code received');
        }

        if (state !== storedState) {
          throw new Error('OAuth state mismatch. This could be a security issue or you may have initiated the login flow multiple times.');
        }

        // Call the appropriate edge function based on auth type
        const functionName = currentAuthType === 'ads' ? 'google-ads-auth' : 'google-search-console-auth';
        const redirectUri = window.location.origin + '/google-callback';
        
        console.log(`Calling ${functionName} edge function with code`);
        const { data, error: functionError } = await supabase.functions.invoke(functionName, {
          body: { 
            action: 'exchange_code',
            code, 
            redirectUri 
          }
        });

        if (functionError || !data?.success) {
          console.error("Edge function error:", functionError, data);
          const errorMsg = functionError?.message || data?.error || `Failed to get Google access token for ${currentAuthType}`;
          const details = data?.details ? JSON.stringify(data.details, null, 2) : null;
          setErrorDetails(details);
          throw new Error(errorMsg);
        }

        const serviceName = currentAuthType === 'ads' ? 'Google Ads' : 'Google Search Console';
        const targetPage = currentAuthType === 'ads' ? '/integrations' : '/search-console';
        
        toast.success(`Successfully connected to ${serviceName}`);
        navigate(targetPage);
      } catch (error) {
        console.error('Google OAuth callback error:', error);
        const errorMsg = (error as Error).message || `Failed to connect to Google ${authType === 'ads' ? 'Ads' : 'Search Console'}`;
        setErrorMessage(errorMsg);
        toast.error(errorMsg);
      } finally {
        setProcessing(false);
      }
    };

    processCallback();
  }, [user, navigate, authType]);

  const goToIntegrations = () => {
    navigate('/integrations');
  };

  const goToGoogleCloudConsole = () => {
    window.open('https://console.cloud.google.com/apis/credentials', '_blank');
  };

  const getServiceName = () => {
    return authType === 'ads' ? 'Google Ads' : 'Google Search Console';
  };

  const getTargetPage = () => {
    return authType === 'ads' ? '/integrations' : '/search-console';
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center p-6">
          {processing ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin mb-2" />
              <h2 className="text-xl font-semibold mt-4">Processing Google Authentication</h2>
              <p className="text-muted-foreground mt-2">Please wait while we connect your {getServiceName()} account...</p>
            </>
          ) : errorMessage ? (
            <>
              <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
              <h2 className="text-xl font-semibold mt-4 text-red-500">Authentication Failed</h2>
              <p className="text-muted-foreground mt-2">{errorMessage}</p>
              
              {errorDetails && (
                <div className="mt-4 bg-slate-100 p-3 rounded-md w-full overflow-x-auto max-h-40">
                  <pre className="text-xs text-slate-700">{errorDetails}</pre>
                </div>
              )}
              
              <div className="flex flex-col gap-3 mt-6 w-full">
                <Button variant="outline" onClick={goToIntegrations}>
                  Return to Integrations
                </Button>
                <Button 
                  variant="outline" 
                  onClick={goToGoogleCloudConsole}
                  className="flex items-center justify-center gap-1"
                >
                  <span>Google Cloud Console</span>
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
              
              <div className="mt-6 text-xs text-muted-foreground">
                <p className="font-medium">Troubleshooting Tips:</p>
                <ul className="list-disc pl-4 mt-1 space-y-1">
                  <li>Verify {getServiceName()} API is enabled</li>
                  <li>Check OAuth consent screen configuration</li>
                  <li>Ensure redirect URIs are properly set to: <code className="bg-gray-100 px-1 py-0.5">{window.location.origin}/google-callback</code></li>
                  <li>Confirm client ID and secret are correctly configured</li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <div className="text-green-500 bg-green-50 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mt-4">Authentication Successful</h2>
              <p className="text-muted-foreground mt-2">Successfully connected to {getServiceName()}!</p>
              <Button className="mt-6" onClick={() => navigate(getTargetPage())}>
                Go to {authType === 'ads' ? 'Integrations' : 'Search Console Dashboard'}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleCallback;
