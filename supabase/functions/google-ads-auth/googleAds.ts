
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { GoogleAdsConfig } from './config.ts';

export async function fetchGoogleAdsAccounts(
  accessToken: string,
  config: GoogleAdsConfig,
  userId: string
): Promise<void> {
  try {
    console.log('Attempting to fetch Google Ads accounts');
    
    const googleAdsUrl = 'https://googleads.googleapis.com/v15/customers:listAccessibleCustomers';
    
    if (!config.developToken) {
      console.warn('Google Ads Developer Token not configured');
    }
    
    const accountsResponse = await fetch(googleAdsUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'developer-token': config.developToken || '',
      },
    });
    
    const accountsData = await accountsResponse.json();
    
    if (accountsResponse.ok && accountsData.resourceNames) {
      const supabase = createClient(config.supabaseUrl, config.supabaseKey);
      
      // Format: customers/{customer_id}
      const customerIds = accountsData.resourceNames.map((name: string) => name.split('/')[1]);
      console.log(`Found ${customerIds.length} Google Ads accounts`);
      
      // Get account names - in a real app you would make additional API calls to get names
      // For simplicity, we'll just use IDs as names in this example
      for (const customerId of customerIds) {
        await supabase
          .from('ad_accounts')
          .upsert({
            user_id: userId,
            platform: 'google',
            account_id: customerId,
            account_name: `Google Ads Account ${customerId}`, // In reality, you'd get the actual name
          }, {
            onConflict: 'user_id,platform,account_id'
          });
      }
    } else {
      console.error('Error fetching Google Ads accounts:', accountsData);
    }
  } catch (error) {
    console.error('Error fetching Google Ads accounts:', error);
    // We don't fail the whole operation if just the accounts fetch fails
  }
}
