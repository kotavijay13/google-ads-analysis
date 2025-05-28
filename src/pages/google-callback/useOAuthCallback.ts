
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

export const useOAuthCallback = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [authType, setAuthType] = useState<'search-console' | 'ads'>('search-console');

  useEffect(() => {
    const processCallback = async () => {
      console.log('Processing Google OAuth callback...');
      console.log('Current URL:', window.location.href);
      console.log('User:', user);

      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const error = urlParams.get('error');
        const errorDescription = urlParams.get('error_description');
        
        console.log('OAuth callback params:', { 
          hasCode: !!code, 
          state, 
          error, 
          errorDescription 
        });
        
        // Determine which type of auth this is based on stored state
        const googleAdsState = localStorage.getItem('googleOAuthState');
        const searchConsoleState = localStorage.getItem('googleSearchConsoleOAuthState');
        
        console.log('Stored states:', { googleAdsState, searchConsoleState });
        
        let currentAuthType: 'search-console' | 'ads' = 'search-console';
        let storedState: string | null = null;
        
        if (state === googleAdsState) {
          currentAuthType = 'ads';
          storedState = googleAdsState;
          localStorage.removeItem('googleOAuthState');
          console.log('Google Ads OAuth flow detected');
        } else if (state === searchConsoleState) {
          currentAuthType = 'search-console';
          storedState = searchConsoleState;
          localStorage.removeItem('googleSearchConsoleOAuthState');
          console.log('Google Search Console OAuth flow detected');
        } else {
          console.warn('No matching state found, checking for Google Ads state');
          // If no state match, check if we have a Google Ads state and assume it's Google Ads
          if (googleAdsState) {
            currentAuthType = 'ads';
            storedState = googleAdsState;
            localStorage.removeItem('googleOAuthState');
            console.log('Defaulting to Google Ads OAuth flow');
          }
        }
        
        setAuthType(currentAuthType);

        if (error) {
          console.error('Google OAuth error:', error, errorDescription);
          throw new Error(`Google OAuth error: ${error}${errorDescription ? ` - ${errorDescription}` : ''}`);
        }

        if (!code) {
          throw new Error('No authorization code received from Google');
        }

        // Wait for user if not available yet
        if (!user) {
          console.log('Waiting for user authentication...');
          // Set a timeout to wait for user
          let retries = 0;
          const maxRetries = 30; // 30 seconds
          
          while (!user && retries < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            retries++;
          }
          
          if (!user) {
            console.error('User not authenticated after timeout');
            navigate('/auth?error=authentication_required');
            return;
          }
        }

        // Call the appropriate edge function based on auth type
        const functionName = currentAuthType === 'ads' ? 'google-ads-auth' : 'google-search-console-auth';
        const redirectUri = window.location.origin + '/google-callback';
        
        console.log(`Calling ${functionName} edge function with redirect URI: ${redirectUri}`);
        
        // Get the auth token to pass to the edge function
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) {
          throw new Error('No valid session found - please log in again');
        }

        console.log('Invoking edge function with authorization');
        const { data, error: functionError } = await supabase.functions.invoke(functionName, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: { 
            action: 'exchange_code',
            code, 
            redirectUri 
          }
        });

        console.log('Edge function response:', { data, functionError });

        if (functionError) {
          console.error("Edge function error:", functionError);
          throw new Error(functionError.message || `Failed to exchange code with ${functionName}`);
        }

        if (!data?.success) {
          console.error("Edge function returned failure:", data);
          const errorMsg = data?.error || `Failed to get Google access token for ${currentAuthType}`;
          const details = data?.details ? JSON.stringify(data.details, null, 2) : null;
          setErrorDetails(details);
          throw new Error(errorMsg);
        }

        const serviceName = currentAuthType === 'ads' ? 'Google Ads' : 'Google Search Console';
        const targetPage = currentAuthType === 'ads' ? '/integrations' : '/search-console';
        
        console.log(`Successfully connected to ${serviceName}`);
        toast.success(`Successfully connected to ${serviceName}`);
        
        // Dispatch success event for Google Ads
        if (currentAuthType === 'ads') {
          window.dispatchEvent(new CustomEvent('google-oauth-success', { 
            detail: { service: 'google-ads' } 
          }));
        }
        
        // Small delay to ensure toast is visible before navigation
        setTimeout(() => {
          navigate(targetPage);
        }, 1000);
        
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
  }, [user, navigate]);

  return {
    processing,
    errorMessage,
    errorDetails,
    authType
  };
};
