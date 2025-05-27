
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { GoogleAdsConfig } from './config.ts';

export async function fetchGoogleAdsAccounts(
  accessToken: string,
  config: GoogleAdsConfig,
  userId: string
): Promise<void> {
  try {
    console.log('Attempting to fetch Google Ads accounts for user:', userId);
    
    const googleAdsUrl = 'https://googleads.googleapis.com/v15/customers:listAccessibleCustomers';
    
    if (!config.developToken) {
      console.warn('Google Ads Developer Token not configured - this may limit account access');
    }
    
    const accountsResponse = await fetch(googleAdsUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'developer-token': config.developToken || '',
      },
    });
    
    console.log('Google Ads API response status:', accountsResponse.status);
    
    if (!accountsResponse.ok) {
      const errorText = await accountsResponse.text();
      console.error('Google Ads API error:', errorText);
      throw new Error(`Google Ads API error: ${accountsResponse.status} - ${errorText}`);
    }
    
    const accountsData = await accountsResponse.json();
    console.log('Google Ads API response:', accountsData);
    
    if (accountsData.resourceNames && accountsData.resourceNames.length > 0) {
      const supabase = createClient(config.supabaseUrl, config.supabaseKey);
      
      // Extract customer IDs from resource names (format: customers/{customer_id})
      const customerIds = accountsData.resourceNames.map((name: string) => name.split('/')[1]);
      console.log(`Found ${customerIds.length} Google Ads customer IDs:`, customerIds);
      
      // For each customer ID, fetch detailed account information
      for (const customerId of customerIds) {
        try {
          // Fetch account details
          const accountDetailUrl = `https://googleads.googleapis.com/v15/customers/${customerId}`;
          
          const detailResponse = await fetch(accountDetailUrl, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'developer-token': config.developToken || '',
            },
          });
          
          let accountName = `Google Ads Account ${customerId}`;
          
          if (detailResponse.ok) {
            const detailData = await detailResponse.json();
            accountName = detailData.descriptiveName || accountName;
            console.log(`Account ${customerId} name: ${accountName}`);
          } else {
            console.warn(`Could not fetch details for account ${customerId}, using default name`);
          }
          
          // Store account in database
          const { error: upsertError } = await supabase
            .from('ad_accounts')
            .upsert({
              user_id: userId,
              platform: 'google',
              account_id: customerId,
              account_name: accountName,
            }, {
              onConflict: 'user_id,platform,account_id'
            });
          
          if (upsertError) {
            console.error(`Error storing account ${customerId}:`, upsertError);
          } else {
            console.log(`Successfully stored account ${customerId}`);
          }
          
        } catch (error) {
          console.error(`Error processing account ${customerId}:`, error);
          // Continue with other accounts even if one fails
        }
      }
      
      console.log(`Successfully processed ${customerIds.length} Google Ads accounts`);
      
    } else {
      console.log('No Google Ads accounts found in API response');
      
      // Check if the user has the necessary permissions
      if (!accountsData.resourceNames) {
        console.warn('User may not have access to any Google Ads accounts or missing permissions');
      }
    }
  } catch (error) {
    console.error('Error fetching Google Ads accounts:', error);
    // We don't fail the whole operation if just the accounts fetch fails
    // The user can still be considered "connected" and try again later
  }
}
