import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { GoogleAdsConfig } from './config.ts';

export async function fetchGoogleAdsAccounts(
  accessToken: string,
  config: GoogleAdsConfig,
  userId: string
): Promise<void> {
  try {
    console.log('Attempting to fetch Google Ads accounts for user:', userId);
    
    // Use the correct Google Ads API endpoint
    const googleAdsUrl = 'https://googleads.googleapis.com/v16/customers:listAccessibleCustomers';
    
    if (!config.developToken) {
      console.warn('Google Ads Developer Token not configured - this may limit account access');
    }
    
    const accountsResponse = await fetch(googleAdsUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'developer-token': config.developToken || '',
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Google Ads API response status:', accountsResponse.status);
    console.log('Google Ads API response headers:', Object.fromEntries(accountsResponse.headers.entries()));
    
    if (!accountsResponse.ok) {
      const errorText = await accountsResponse.text();
      console.error('Google Ads API error response:', errorText);
      
      // Try to parse error for more details
      let errorDetails = errorText;
      try {
        const errorJson = JSON.parse(errorText);
        errorDetails = errorJson.error?.message || errorText;
      } catch (e) {
        // Keep original error text if not JSON
      }
      
      throw new Error(`Google Ads API error: ${accountsResponse.status} - ${errorDetails}`);
    }
    
    const accountsData = await accountsResponse.json();
    console.log('Google Ads API response data:', accountsData);
    
    if (accountsData.resourceNames && accountsData.resourceNames.length > 0) {
      const supabase = createClient(config.supabaseUrl, config.supabaseKey);
      
      // Extract customer IDs from resource names (format: customers/{customer_id})
      const customerIds = accountsData.resourceNames.map((name: string) => {
        const parts = name.split('/');
        return parts[parts.length - 1]; // Get the last part which is the customer ID
      });
      console.log(`Found ${customerIds.length} Google Ads customer IDs:`, customerIds);
      
      // For each customer ID, fetch detailed account information
      for (const customerId of customerIds) {
        try {
          console.log(`Fetching details for customer ID: ${customerId}`);
          
          // Use Google Ads API v16 to get customer details
          const accountDetailUrl = `https://googleads.googleapis.com/v16/customers/${customerId}`;
          
          const detailResponse = await fetch(accountDetailUrl, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'developer-token': config.developToken || '',
              'Content-Type': 'application/json',
            },
          });
          
          let accountName = `Google Ads Account ${customerId}`;
          
          if (detailResponse.ok) {
            const detailData = await detailResponse.json();
            console.log(`Account ${customerId} details:`, detailData);
            accountName = detailData.descriptiveName || detailData.name || accountName;
            console.log(`Account ${customerId} name: ${accountName}`);
          } else {
            const errorText = await detailResponse.text();
            console.warn(`Could not fetch details for account ${customerId}:`, errorText);
            console.log(`Using default name for account ${customerId}`);
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
            console.log(`Successfully stored account ${customerId} with name: ${accountName}`);
          }
          
        } catch (error) {
          console.error(`Error processing account ${customerId}:`, error);
          // Continue with other accounts even if one fails
        }
      }
      
      console.log(`Successfully processed ${customerIds.length} Google Ads accounts`);
      
    } else {
      console.log('No Google Ads accounts found in API response');
      console.log('Response structure:', JSON.stringify(accountsData, null, 2));
      
      // Check if the user has the necessary permissions
      if (!accountsData.resourceNames) {
        console.warn('User may not have access to any Google Ads accounts or missing permissions');
        console.warn('This could be due to:');
        console.warn('1. No Google Ads accounts associated with this Google account');
        console.warn('2. Missing developer token or incorrect permissions');
        console.warn('3. Google Ads accounts not properly linked to this Google account');
      }
    }
  } catch (error) {
    console.error('Error fetching Google Ads accounts:', error);
    // We don't fail the whole operation if just the accounts fetch fails
    // The user can still be considered "connected" and try again later
    throw error; // Re-throw to let the caller know there was an issue
  }
}
