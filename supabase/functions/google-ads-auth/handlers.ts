
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
    
    console.log('OAuth token exchange successful, now attempting to fetch Google Ads accounts...');
    
    // Try to fetch Google Ads accounts
    try {
      await fetchGoogleAdsAccounts(tokenData.access_token, config, user.id);
      console.log('Google Ads accounts fetch completed successfully');
      
      return new Response(
        JSON.stringify({ 
          success: true,
          message: 'Successfully connected to Google Ads and fetched accounts'
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (accountError) {
      console.error('Error fetching Google Ads accounts:', accountError);
      
      // OAuth was successful but account fetching failed
      // Return success for OAuth but include warning about accounts
      return new Response(
        JSON.stringify({ 
          success: true, 
          warning: 'Google authentication successful, but failed to fetch Google Ads accounts. This could be due to missing developer token, API permissions, or no Google Ads accounts associated with your Google account.',
          error: (accountError as Error).message,
          troubleshooting: {
            suggestions: [
              'Ensure Google Ads API is enabled in Google Cloud Console',
              'Verify you have a Google Ads Developer Token configured',
              'Check that your Google account has access to Google Ads accounts',
              'Make sure Google Ads accounts are properly linked to your Google account'
            ]
          }
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
  } catch (error) {
    console.error('Error in handleExchangeCode:', error);
    throw error;
  }
}
