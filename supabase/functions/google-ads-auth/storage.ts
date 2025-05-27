
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import { TokenData } from './oauth.ts';

export async function storeTokens(
  supabase: SupabaseClient,
  userId: string,
  tokenData: TokenData
) {
  console.log('Storing tokens in database');
  
  // Calculate token expiry time
  const expiresAt = new Date();
  expiresAt.setSeconds(expiresAt.getSeconds() + tokenData.expires_in);
  
  const { data: tokenRecord, error: tokenError } = await supabase
    .from('api_tokens')
    .upsert({
      user_id: userId,
      provider: 'google',
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_at: expiresAt.toISOString(),
    }, {
      onConflict: 'user_id,provider'
    })
    .select()
    .single();
  
  if (tokenError) {
    console.error('Error storing tokens:', tokenError);
    throw new Error(`Failed to store access tokens: ${tokenError.message}`);
  }
  
  return tokenRecord;
}
