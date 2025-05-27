
import { validateConfig } from './config.ts';
import { exchangeCodeForTokens } from './oauth.ts';
import { getUserFromRequest } from './auth.ts';
import { storeTokens } from './storage.ts';
import { fetchGoogleAdsAccounts } from './googleAds.ts';

export async function handleGetClientId() {
  try {
    console.log('Getting Google client ID from config');
    const config = validateConfig();
    console.log('Successfully retrieved client ID');
    
    return new Response(
      JSON.stringify({ clientId: config.clientId }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error getting client ID:', error);
    throw error;
  }
}

export async function handleExchangeCode(req: Request, requestData: any) {
  const { code, redirectUri } = requestData;
  
  console.log('Starting token exchange process');
  console.log('Has code:', !!code);
  console.log('Redirect URI:', redirectUri);
  
  // Validate required data
  if (!code) {
    console.error('Missing authorization code');
    throw new Error('Missing authorization code');
  }
  
  if (!redirectUri) {
    console.error('Missing redirect URI');
    throw new Error('Missing redirect URI');
  }
  
  try {
    const config = validateConfig();
    console.log('Config validated successfully');
    
    const { user, supabase } = await getUserFromRequest(req, config);
    console.log(`Processing token exchange for user: ${user.email}`);
    
    // Exchange code for tokens
    console.log('Exchanging authorization code for tokens');
    const tokenData = await exchangeCodeForTokens(code, redirectUri, config);
    console.log('Token exchange successful');
    
    // Store tokens in database
    console.log('Storing tokens in database');
    await storeTokens(supabase, user.id, tokenData);
    console.log('Tokens stored successfully');
    
    // Fetch Google Ads accounts
    console.log('Fetching Google Ads accounts');
    await fetchGoogleAdsAccounts(tokenData.access_token, config, user.id);
    console.log('Google Ads accounts fetch completed');
    
    return new Response(
      JSON.stringify({ success: true, message: 'Google Ads connected successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in handleExchangeCode:', error);
    throw error;
  }
}
