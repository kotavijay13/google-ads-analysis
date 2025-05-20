
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import MetaAuthButton from './meta-ads/MetaAuthButton';
import MetaAccountSelector from './meta-ads/MetaAccountSelector';
import SelectedAccountInfo from './meta-ads/SelectedAccountInfo';
import MetaAccountsTable from './meta-ads/MetaAccountsTable';
import { useMetaAdsAccounts } from './meta-ads/useMetaAdsAccounts';
import { useState } from 'react';

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
      
      // Generate a random state for OAuth security
      const state = Math.random().toString(36).substring(2);
      // Save the state in localStorage to verify later
      localStorage.setItem('metaOAuthState', state);
      
      // Create the OAuth URL using the environment variable
      const oauthEndpoint = 'https://www.facebook.com/v19.0/dialog/oauth';
      const redirectUri = window.location.origin + '/meta-callback';
      const scope = 'ads_management,ads_read';
      
      // Use a valid Meta app client ID from Meta for Developers console
      // Make sure this matches your META_APP_ID in Supabase secrets
      const clientId = process.env.META_APP_ID || '1234567890123456';
      
      // Construct the OAuth URL
      const oauthUrl = `${oauthEndpoint}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&state=${state}`;
      
      // Redirect to Meta's OAuth page
      window.location.href = oauthUrl;
    } catch (err) {
      console.error('Meta connect error:', err);
      setAuthError('Failed to initiate Meta connection.');
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
