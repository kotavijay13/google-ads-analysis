
import { GoogleAdsConfig } from './config.ts';

export interface TokenData {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export async function exchangeCodeForTokens(
  code: string,
  redirectUri: string,
  config: GoogleAdsConfig
): Promise<TokenData> {
  console.log(`Exchanging code for tokens`);
  console.log(`Using redirect URI: ${redirectUri}`);
  console.log(`Using client ID: ${config.clientId.substring(0, 8)}...`);
  
  const tokenRequestBody = new URLSearchParams({
    code,
    client_id: config.clientId,
    client_secret: config.clientSecret,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  });
  
  console.log("Token request payload:", tokenRequestBody.toString());
  
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: tokenRequestBody,
  });
  
  const tokenData = await tokenResponse.json();
  
  if (!tokenResponse.ok || !tokenData.access_token) {
    console.error('Google OAuth token error:', tokenData);
    throw new Error(
      JSON.stringify({
        error: tokenData.error_description || tokenData.error || 'Failed to get access token',
        details: tokenData,
        status: tokenResponse.status,
        statusText: tokenResponse.statusText
      })
    );
  }
  
  console.log('Successfully obtained access token');
  return tokenData;
}
