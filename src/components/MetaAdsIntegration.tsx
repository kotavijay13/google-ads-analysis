
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import MetaAuthButton from './meta-ads/MetaAuthButton';
import MetaAccountSelector from './meta-ads/MetaAccountSelector';
import SelectedAccountInfo from './meta-ads/SelectedAccountInfo';
import MetaAccountsTable from './meta-ads/MetaAccountsTable';
import { useMetaAdsAccounts } from './meta-ads/useMetaAdsAccounts';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const MetaAdsIntegration = () => {
  const {
    loading,
    accounts,
    connected,
    selectedAccount,
    fetchAccounts,
    handleSelectAccount
  } = useMetaAdsAccounts();
  
  const [authError, setAuthError] = useState<string | null>(null);

  const handleConnect = async () => {
    try {
      // Reset any previous errors
      setAuthError(null);

      const { data: clientData, error: clientError } = await supabase.functions.invoke('meta-ads-auth', {
        body: { 
          action: 'get_client_id'
        }
      });

      if (clientError || !clientData?.clientId) {
        console.error("Failed to get Meta client ID:", clientError, clientData);
        throw new Error(clientError?.message || 'Could not retrieve Meta App ID. Please check your configuration.');
      }
      
      const clientId = clientData.clientId;
      
      // Generate a random state for OAuth security
      const state = Math.random().toString(36).substring(2);
      // Save the state in localStorage to verify later
      localStorage.setItem('metaOAuthState', state);
      
      // Create the OAuth URL
      const oauthEndpoint = 'https://www.facebook.com/v19.0/dialog/oauth';
      const redirectUri = window.location.origin + '/meta-callback';
      const scope = 'ads_management,ads_read';
      
      // Construct the OAuth URL
      const oauthUrl = `${oauthEndpoint}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&state=${state}`;
      
      // Redirect to Meta's OAuth page
      window.location.href = oauthUrl;
    } catch (err) {
      console.error('Meta connect error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to initiate Meta connection.';
      setAuthError(errorMessage);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Meta Ads Integration</CardTitle>
        <CardDescription>Connect to your Meta Ads accounts</CardDescription>
      </CardHeader>
      <CardContent>
        <MetaAuthButton 
          connected={connected} 
          onConnect={handleConnect} 
          onRefreshAccounts={fetchAccounts}
          error={authError}
        />
        
        {connected && (
          <>
            {accounts.length > 0 && (
              <MetaAccountSelector 
                accounts={accounts}
                selectedAccount={selectedAccount}
                onSelectAccount={handleSelectAccount}
              />
            )}
            
            <SelectedAccountInfo selectedAccount={selectedAccount} />
            
            <MetaAccountsTable 
              accounts={accounts}
              selectedAccount={selectedAccount}
              loading={loading}
              onSelectAccount={handleSelectAccount}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MetaAdsIntegration;
