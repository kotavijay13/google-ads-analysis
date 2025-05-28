
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
    
    if (!accountsResponse.ok) {
      const errorText = await accountsResponse.text();
      console.error('Google Ads API error response:', errorText);
      
      let errorDetails = errorText;
      try {
        const errorJson = JSON.parse(errorText);
        console.log('Parsed error JSON:', errorJson);
        errorDetails = errorJson.error?.message || errorJson.message || errorText;
      } catch (e) {
        console.log('Could not parse error as JSON:', e);
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
      
      // Get user info to help with account naming
      let userEmail = '';
      let businessDomain = '';
      
      try {
        const userinfoUrl = 'https://www.googleapis.com/oauth2/v2/userinfo';
        const userinfoResponse = await fetch(userinfoUrl, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        
        if (userinfoResponse.ok) {
          const userInfo = await userinfoResponse.json();
          console.log('User info retrieved:', { email: userInfo.email, name: userInfo.name });
          userEmail = userInfo.email || '';
          
          if (userEmail && userEmail.includes('@')) {
            const domain = userEmail.split('@')[1];
            if (domain && domain !== 'gmail.com' && domain !== 'yahoo.com' && domain !== 'hotmail.com') {
              businessDomain = domain;
              console.log('Business domain identified:', businessDomain);
            }
          }
        }
      } catch (error) {
        console.log('Could not fetch user info:', error);
      }
      
      // Try to get business information using Google My Business API
      let businessName = '';
      try {
        const mybusinessUrl = 'https://mybusinessaccountmanagement.googleapis.com/v1/accounts';
        const mybusinessResponse = await fetch(mybusinessUrl, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        
        if (mybusinessResponse.ok) {
          const mybusinessData = await mybusinessResponse.json();
          console.log('Google My Business data:', mybusinessData);
          
          if (mybusinessData.accounts && mybusinessData.accounts.length > 0) {
            businessName = mybusinessData.accounts[0].accountName || '';
            console.log('Business name from My Business API:', businessName);
          }
        } else {
          console.log('My Business API not accessible or no permissions');
        }
      } catch (error) {
        console.log('Could not fetch My Business data:', error);
      }
      
      // For each customer ID, create a more meaningful name and store in database
      for (let i = 0; i < customerIds.length; i++) {
        const customerId = customerIds[i];
        console.log(`Processing customer ID: ${customerId}`);
        
        let accountName = `Google Ads Account ${customerId}`;
        
        // Create better account names based on available information
        if (businessName) {
          accountName = customerIds.length > 1 
            ? `${businessName} - Account ${i + 1}` 
            : businessName;
        } else if (businessDomain) {
          const domainName = businessDomain.split('.')[0];
          const capitalizedDomain = domainName.charAt(0).toUpperCase() + domainName.slice(1);
          accountName = customerIds.length > 1 
            ? `${capitalizedDomain} - Account ${i + 1}` 
            : `${capitalizedDomain} Ads`;
        } else if (userEmail) {
          // Use the first part of email if it's not a common provider
          const emailPrefix = userEmail.split('@')[0];
          if (emailPrefix && emailPrefix.length > 3) {
            accountName = customerIds.length > 1 
              ? `${emailPrefix} - Account ${i + 1}` 
              : `${emailPrefix} Ads`;
          }
        }
        
        console.log(`Generated account name for ${customerId}: ${accountName}`);
        
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
      }
      
      console.log(`Successfully processed ${customerIds.length} Google Ads accounts with improved naming`);
      
    } else {
      console.log('No Google Ads accounts found in API response');
      console.log('Response structure:', JSON.stringify(accountsData, null, 2));
    }
  } catch (error) {
    console.error('Error fetching Google Ads accounts:', error);
    throw error;
  }
}
