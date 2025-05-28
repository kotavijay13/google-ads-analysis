
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

export async function handleSyncAccounts(req: Request) {
  const config = validateConfig();
  const { user, supabase } = await getUserFromRequest(req, config);
  
  console.log(`Manual account sync requested for user ${user.email}`);
  
  try {
    // Get the user's access token
    const { data: tokenData, error: tokenError } = await supabase
      .from('api_tokens')
      .select('access_token')
      .eq('user_id', user.id)
      .eq('provider', 'google')
      .single();
    
    if (tokenError || !tokenData) {
      console.error('No valid Google token found for user:', user.id);
      throw new Error('No valid Google authentication found. Please reconnect your Google account.');
    }
    
    console.log('Found valid Google token, attempting to fetch accounts...');
    
    // Try to fetch Google Ads accounts
    await fetchGoogleAdsAccounts(tokenData.access_token, config, user.id);
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Account sync completed successfully'
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error in handleSyncAccounts:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: (error as Error).message,
        details: 'Check the edge function logs for more information'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
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
          warning: 'Google authentication successful, but failed to fetch Google Ads accounts. You can try manual sync from the integrations page.',
          error: (accountError as Error).message,
          troubleshooting: {
            suggestions: [
              'Try the manual account sync feature',
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
