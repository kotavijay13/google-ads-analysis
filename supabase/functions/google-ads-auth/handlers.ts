
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
  
  // Exchange code for tokens
  const tokenData = await exchangeCodeForTokens(code, redirectUri, config);
  
  // Store tokens in database
  await storeTokens(supabase, user.id, tokenData);
  
  // Fetch Google Ads accounts
  await fetchGoogleAdsAccounts(tokenData.access_token, config, user.id);
  
  return new Response(
    JSON.stringify({ success: true }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}
