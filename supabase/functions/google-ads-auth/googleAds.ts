
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { GoogleAdsConfig } from './config.ts';

export async function fetchGoogleAdsAccounts(
  accessToken: string,
  config: GoogleAdsConfig,
  userId: string
): Promise<void> {
  try {
    console.log('Attempting to fetch Google Ads accounts for user:', userId);
    
    // Use the current Google Ads API version (v17 is the latest stable)
    const listCustomersUrl = 'https://googleads.googleapis.com/v17/customers:listAccessibleCustomers';
    
    console.log('Calling Google Ads API:', listCustomersUrl);
    console.log('Using developer token:', config.developToken ? 'Present' : 'Missing');
    
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
    
    // Add developer token if available
    if (config.developToken) {
      headers['developer-token'] = config.developToken;
    }
    
    console.log('Request headers:', Object.keys(headers));
    
    const accountsResponse = await fetch(listCustomersUrl, {
      method: 'GET',
      headers: headers,
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
        errorDetails = errorJson.error?.message || errorJson.message || errorText;
      } catch (e) {
        // Keep original error text if not JSON
      }
      
      // Special handling for common errors
      if (accountsResponse.status === 404) {
        console.error('404 Error - This usually means:');
        console.error('1. Invalid API endpoint URL');
        console.error('2. Missing developer token');
        console.error('3. API not enabled in Google Cloud');
        
        throw new Error(`Google Ads API 404 error. Please ensure: 1) Google Ads API is enabled in Google Cloud Console, 2) Developer token is configured, 3) Account has Google Ads access. Details: ${errorDetails}`);
      } else if (accountsResponse.status === 401) {
        throw new Error(`Google Ads API authentication error. Please reconnect your Google account. Details: ${errorDetails}`);
      } else if (accountsResponse.status === 403) {
        throw new Error(`Google Ads API permission error. Please ensure your Google account has access to Google Ads and the API is enabled. Details: ${errorDetails}`);
      }
      
      throw new Error(`Google Ads API error: ${accountsResponse.status} - ${errorDetails}`);
    }
    
    const accountsData = await accountsResponse.json();
    console.log('Google Ads API response data:', accountsData);
    
    // Check if we have resource names (customer IDs)
    if (accountsData.resourceNames && accountsData.resourceNames.length > 0) {
      const supabase = createClient(config.supabaseUrl, config.supabaseKey);
      
      // Extract customer IDs from resource names (format: customers/{customer_id})
      const customerIds = accountsData.resourceNames.map((name: string) => {
        const parts = name.split('/');
        return parts[parts.length - 1]; // Get the last part which is the customer ID
      });
      console.log(`Found ${customerIds.length} Google Ads customer IDs:`, customerIds);
      
      // For each customer ID, try to get account details and store in database
      for (const customerId of customerIds) {
        try {
          console.log(`Processing customer ID: ${customerId}`);
          
          let accountName = `Google Ads Account ${customerId}`;
          
          // Try to get customer details (this might fail if we don't have access)
          try {
            const customerDetailUrl = `https://googleads.googleapis.com/v17/customers/${customerId}`;
            
            const detailResponse = await fetch(customerDetailUrl, {
              method: 'GET',
              headers: headers,
            });
            
            if (detailResponse.ok) {
              const detailData = await detailResponse.json();
              console.log(`Customer ${customerId} details:`, detailData);
              accountName = detailData.descriptiveName || detailData.name || accountName;
            } else {
              console.log(`Could not fetch details for customer ${customerId}, using default name`);
            }
          } catch (error) {
            console.log(`Error fetching details for customer ${customerId}:`, error);
            // Continue with default name
          }
          
          // Store account in database
          console.log(`Storing account ${customerId} with name: ${accountName}`);
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
          console.error(`Error processing customer ${customerId}:`, error);
          // Continue with other accounts even if one fails
        }
      }
      
      console.log(`Successfully processed ${customerIds.length} Google Ads accounts`);
      
    } else {
      console.log('No Google Ads accounts found in API response');
      console.log('Response structure:', JSON.stringify(accountsData, null, 2));
      
      // This could mean:
      // 1. User has no Google Ads accounts
      // 2. User doesn't have permission to access Google Ads accounts
      // 3. The Google account is not linked to any Google Ads accounts
      
      console.warn('Possible reasons for no accounts:');
      console.warn('1. No Google Ads accounts associated with this Google account');
      console.warn('2. Google Ads accounts not properly linked to this Google account');
      console.warn('3. Missing permissions or developer token');
      console.warn('4. User needs to accept Google Ads API terms');
      
      // Don't throw an error here - this is a valid case where user has no accounts
      // Just log it for debugging
    }
  } catch (error) {
    console.error('Error fetching Google Ads accounts:', error);
    // Re-throw to let the caller handle the error appropriately
    throw error;
  }
}
