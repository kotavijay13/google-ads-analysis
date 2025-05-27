
import { supabase } from '@/integrations/supabase/client';

export const initiateGoogleAdsOAuth = async (): Promise<void> => {
  const state = Math.random().toString(36).substring(2);
  localStorage.setItem('googleOAuthState', state);
  
  const redirectUri = window.location.origin + '/google-callback';
  
  console.log('OAuth parameters:', { redirectUri, state });
  console.log('Current domain:', window.location.origin);
  
  console.log("Getting Google client ID from edge function");
  const { data: clientData, error: clientError } = await supabase.functions.invoke('google-ads-auth', {
    body: { 
      action: 'get_client_id'
    }
  });
  
  if (clientError || !clientData?.clientId) {
    console.error("Failed to get client ID:", clientError, clientData);
    throw new Error('Could not retrieve Google Client ID. Please check your configuration.');
  }
  
  const clientId = clientData.clientId;
  const scope = encodeURIComponent('https://www.googleapis.com/auth/adwords');
  
  console.log("Starting Google OAuth with client ID:", clientId.substring(0, 8) + '...');
  
  const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&state=${state}&access_type=offline&prompt=consent&include_granted_scopes=true`;
  
  console.log('Redirecting to OAuth URL with redirect URI:', redirectUri);
  
  window.location.href = oauthUrl;
};
