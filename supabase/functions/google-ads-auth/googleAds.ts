
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
    
    // Add developer token if available - this is required for Google Ads API
    if (config.developToken) {
      headers['developer-token'] = config.developToken;
    } else {
      console.error('Developer token is missing - this is required for Google Ads API');
      throw new Error('Google Ads Developer Token is not configured. Please check your environment variables.');
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
        console.log('Parsed error JSON:', errorJson);
        errorDetails = errorJson.error?.message || errorJson.message || errorText;
        
        // Log additional error details for debugging
        if (errorJson.error?.details) {
          console.log('Error details:', errorJson.error.details);
        }
      } catch (e) {
        console.log('Could not parse error as JSON:', e);
      }
      
      // Special handling for common errors
      if (accountsResponse.status === 400) {
        console.error('400 Error - This usually means:');
        console.error('1. Missing or invalid developer token');
        console.error('2. Invalid request format or missing required parameters');
        console.error('3. Account doesn\'t have Google Ads API access');
        console.error('4. OAuth scope insufficient for Google Ads API');
        
        throw new Error(`Google Ads API 400 error. Common causes: 1) Missing developer token, 2) Insufficient OAuth scopes (need 'https://www.googleapis.com/auth/adwords'), 3) Account lacks Google Ads API access. Details: ${errorDetails}`);
      } else if (accountsResponse.status === 401) {
        throw new Error(`Google Ads API authentication error. Please reconnect your Google account. Details: ${errorDetails}`);
      } else if (accountsResponse.status === 403) {
        throw new Error(`Google Ads API permission error. Please ensure your Google account has access to Google Ads and the API is enabled. Details: ${errorDetails}`);
      } else if (accountsResponse.status === 404) {
        throw new Error(`Google Ads API 404 error. Please ensure: 1) Google Ads API is enabled in Google Cloud Console, 2) Developer token is configured, 3) Account has Google Ads access. Details: ${errorDetails}`);
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
      
      // Find the manager account (usually the first one or one that can access others)
      let managerCustomerId = customerIds[0]; // Default to first
      
      // For each customer ID, try to get account details and store in database
      for (const customerId of customerIds) {
        try {
          console.log(`Processing customer ID: ${customerId}`);
          
          let accountName = `Google Ads Account ${customerId}`;
          
          // Try multiple approaches to get the account name
          try {
            // Method 1: Try using the customer itself as login-customer-id
            console.log(`Method 1: Trying to fetch customer details for ${customerId} using self as login customer`);
            
            const customerDetailUrl = `https://googleads.googleapis.com/v17/customers/${customerId}/googleAds:searchStream`;
            
            const detailHeaders = {
              ...headers,
              'login-customer-id': customerId
            };
            
            const queryBody = {
              query: `SELECT customer.descriptive_name, customer.id, customer.manager FROM customer LIMIT 1`
            };
            
            console.log(`Query for ${customerId}:`, queryBody.query);
            
            const detailResponse = await fetch(customerDetailUrl, {
              method: 'POST',
              headers: detailHeaders,
              body: JSON.stringify(queryBody)
            });
            
            if (detailResponse.ok) {
              const detailData = await detailResponse.json();
              console.log(`Customer ${customerId} details response (Method 1):`, detailData);
              
              if (detailData.results && detailData.results.length > 0) {
                const customerInfo = detailData.results[0];
                if (customerInfo.customer) {
                  if (customerInfo.customer.descriptiveName) {
                    accountName = customerInfo.customer.descriptiveName;
                    console.log(`✓ Found descriptive name for ${customerId}: ${accountName}`);
                  }
                  
                  // Check if this is a manager account
                  if (customerInfo.customer.manager) {
                    console.log(`Customer ${customerId} is a manager account`);
                    managerCustomerId = customerId;
                  }
                }
              }
            } else {
              const errorText = await detailResponse.text();
              console.log(`Method 1 failed for ${customerId}, status: ${detailResponse.status}, error:`, errorText);
              
              // Method 2: Try using manager customer ID if different
              if (managerCustomerId !== customerId) {
                console.log(`Method 2: Trying to fetch ${customerId} details using manager ${managerCustomerId}`);
                
                const managerHeaders = {
                  ...headers,
                  'login-customer-id': managerCustomerId
                };
                
                const managerResponse = await fetch(customerDetailUrl, {
                  method: 'POST',
                  headers: managerHeaders,
                  body: JSON.stringify(queryBody)
                });
                
                if (managerResponse.ok) {
                  const managerData = await managerResponse.json();
                  console.log(`Customer ${customerId} details via manager (Method 2):`, managerData);
                  
                  if (managerData.results && managerData.results.length > 0) {
                    const customerInfo = managerData.results[0];
                    if (customerInfo.customer && customerInfo.customer.descriptiveName) {
                      accountName = customerInfo.customer.descriptiveName;
                      console.log(`✓ Found descriptive name via manager for ${customerId}: ${accountName}`);
                    }
                  }
                } else {
                  const managerError = await managerResponse.text();
                  console.log(`Method 2 also failed for ${customerId}:`, managerError);
                  
                  // Method 3: Try the direct customer endpoint
                  try {
                    console.log(`Method 3: Trying direct customer endpoint for ${customerId}`);
                    const directUrl = `https://googleads.googleapis.com/v17/customers/${customerId}`;
                    
                    const directResponse = await fetch(directUrl, {
                      method: 'GET',
                      headers: managerHeaders,
                    });
                    
                    if (directResponse.ok) {
                      const directData = await directResponse.json();
                      console.log(`Direct customer ${customerId} details (Method 3):`, directData);
                      
                      if (directData.descriptiveName) {
                        accountName = directData.descriptiveName;
                        console.log(`✓ Found descriptive name via direct method for ${customerId}: ${accountName}`);
                      }
                    } else {
                      console.log(`Method 3 also failed for ${customerId}`);
                    }
                  } catch (directError) {
                    console.log(`Method 3 error for ${customerId}:`, directError);
                  }
                }
              }
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
            console.log(`Successfully stored account ${customerId} with name: ${accountName}`);
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
      // 4. OAuth scope is insufficient
      
      console.warn('Possible reasons for no accounts:');
      console.warn('1. No Google Ads accounts associated with this Google account');
      console.warn('2. Google Ads accounts not properly linked to this Google account');
      console.warn('3. Missing permissions or developer token');
      console.warn('4. OAuth scope insufficient - need https://www.googleapis.com/auth/adwords');
      console.warn('5. User needs to accept Google Ads API terms');
      
      // Don't throw an error here - this is a valid case where user has no accounts
      // Just log it for debugging
    }
  } catch (error) {
    console.error('Error fetching Google Ads accounts:', error);
    // Re-throw to let the caller handle the error appropriately
    throw error;
  }
}
