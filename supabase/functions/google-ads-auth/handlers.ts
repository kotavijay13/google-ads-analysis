
import { validateConfig } from './config.ts';
import { exchangeCodeForTokens } from './oauth.ts';
import { getUserFromRequest } from './auth.ts';
import { storeTokens } from './storage.ts';
import { fetchGoogleAdsAccounts } from './googleAds.ts';

export async function handleGetClientId() {
  const config = validateConfig();
  
  return new Response(
    JSON.stringify({ clientId: config.clientId }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}

export async function handleExchangeCode(req: Request, requestData: any) {
  const { code, redirectUri } = requestData;
  
  // Validate required data
  if (!code) {
    throw new Error('Missing authorization code');
  }
  
  if (!redirectUri) {
    throw new Error('Missing redirect URI');
  }
  
  const config = validateConfig();
  const { user, supabase } = await getUserFromRequest(req, config);
  
  console.log(`Exchanging code for tokens for user ${user.email}`);
  
  try {
    // Exchange code for tokens
    const tokenData = await exchangeCodeForTokens(code, redirectUri, config);
    
    // Store tokens in database
    await storeTokens(supabase, user.id, tokenData);
    
    // Fetch Google Ads accounts
    console.log('Attempting to fetch Google Ads accounts...');
    await fetchGoogleAdsAccounts(tokenData.access_token, config, user.id);
    console.log('Google Ads accounts fetch completed');
    
    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in handleExchangeCode:', error);
    
    // If it's a Google Ads accounts fetch error, still return success for the OAuth
    // but log the specific error
    if (error instanceof Error && error.message.includes('Google Ads API error')) {
      console.error('Google Ads API failed, but OAuth was successful:', error.message);
      return new Response(
        JSON.stringify({ 
          success: true, 
          warning: 'OAuth successful but failed to fetch accounts. Try refreshing accounts later.',
          error: error.message 
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // For other errors, re-throw
    throw error;
  }
}
