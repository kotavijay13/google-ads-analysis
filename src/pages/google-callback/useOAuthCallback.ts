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
    // Prevent multiple processing
    if (processing === false) return;
    
    const processCallback = async () => {
      console.log('Processing Google OAuth callback...');
      console.log('Current URL:', window.location.href);
      console.log('Search params:', window.location.search);
      
      if (!user) {
        console.log('No user found during callback, waiting for auth...');
        return;
      }

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
        
        // Determine which type of auth this is based on stored state and scopes
        const googleAdsState = localStorage.getItem('googleOAuthState');
        const searchConsoleState = localStorage.getItem('googleSearchConsoleOAuthState');
        const scopes = urlParams.get('scope') || '';
        
        console.log('Stored states:', { googleAdsState, searchConsoleState });
        console.log('OAuth scopes:', scopes);
        
        let currentAuthType: 'search-console' | 'ads' = 'search-console';
        let storedState: string | null = null;
        
        // Prioritize exact state match first
        if (state === searchConsoleState) {
          currentAuthType = 'search-console';
          storedState = searchConsoleState;
          localStorage.removeItem('googleSearchConsoleOAuthState');
          console.log('Google Search Console OAuth flow detected (state match)');
        } else if (state === googleAdsState) {
          currentAuthType = 'ads';
          storedState = googleAdsState;
          localStorage.removeItem('googleOAuthState');
          console.log('Google Ads OAuth flow detected (state match)');
        } else {
          // If no exact state match, use scopes to determine the service
          if (scopes.includes('webmasters') && !scopes.includes('adwords')) {
            currentAuthType = 'search-console';
            console.log('Google Search Console OAuth flow detected (scope-based)');
          } else if (scopes.includes('adwords') && !scopes.includes('webmasters')) {
            currentAuthType = 'ads';
            console.log('Google Ads OAuth flow detected (scope-based)');
          } else {
            console.warn('No matching state found and ambiguous scopes');
            // Default to search console if unclear
            currentAuthType = 'search-console';
            console.log('Defaulting to Google Search Console OAuth flow');
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

        // Call the appropriate edge function based on auth type
        const functionName = currentAuthType === 'ads' ? 'google-ads-auth' : 'google-search-console-auth';
        const redirectUri = window.location.origin + '/google-callback';
        
        console.log(`Calling ${functionName} edge function`);
        console.log('Using redirect URI:', redirectUri);
        
        // Get the auth token to pass to the edge function
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) {
          throw new Error('No valid session found');
        }

        const { data, error: functionError } = await supabase.functions.invoke(functionName, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
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
        const targetPage = currentAuthType === 'ads' ? '/integrations' : '/seo';
        
        console.log(`Successfully connected to ${serviceName}`);
        toast.success(`Successfully connected to ${serviceName}`);
        
        // Dispatch success event for Google Ads
        if (currentAuthType === 'ads') {
          console.log('Dispatching Google Ads success event');
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

    // Only process if we have URL parameters
    if (window.location.search) {
      processCallback();
    } else {
      console.log('No search parameters, redirecting to auth');
      navigate('/auth');
    }
  }, [user, navigate]);

  return {
    processing,
    errorMessage,
    errorDetails,
    authType
  };
};
