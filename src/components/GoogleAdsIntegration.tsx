
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGoogleAdsIntegration } from './google-ads/useGoogleAdsIntegration';
import GoogleAdsAuthButton from './google-ads/GoogleAdsAuthButton';
import GoogleAdsConnectionStatus from './google-ads/GoogleAdsConnectionStatus';
import GoogleAdsAccountSelector from './google-ads/GoogleAdsAccountSelector';
import GoogleAdsAccountsTable from './google-ads/GoogleAdsAccountsTable';

const GoogleAdsIntegration = () => {
  const {
    loading,
    refreshing,
    accounts,
    connected,
    configError,
    selectedAccount,
    handleConnect,
    handleRefreshAccounts,
    handleSelectAccount,
  } = useGoogleAdsIntegration();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Google Ads Integration</CardTitle>
        <CardDescription>Connect to your Google Ads accounts</CardDescription>
      </CardHeader>
      <CardContent>
        {!connected ? (
          <GoogleAdsAuthButton 
            loading={loading}
            configError={configError}
            onConnect={handleConnect}
          />
        ) : (
          <>
            <GoogleAdsConnectionStatus 
              refreshing={refreshing}
              onRefreshAccounts={handleRefreshAccounts}
            />
            
            <GoogleAdsAccountSelector 
              accounts={accounts}
              selectedAccount={selectedAccount}
              onSelectAccount={handleSelectAccount}
            />
            
            <GoogleAdsAccountsTable 
              accounts={accounts}
              selectedAccount={selectedAccount}
              onSelectAccount={handleSelectAccount}
              onRefreshAccounts={handleRefreshAccounts}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default GoogleAdsIntegration;
