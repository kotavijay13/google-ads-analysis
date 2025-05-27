
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface GoogleAdsAccount {
  id: string;
  name: string;
}

const GoogleAdsIntegration = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [accounts, setAccounts] = useState<GoogleAdsAccount[]>([]);
  const [connected, setConnected] = useState(false);
  const [configError, setConfigError] = useState<string | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      checkConnection();
      fetchAccounts();
    }
  }, [user]);

  // Listen for successful OAuth completion
  useEffect(() => {
    const handleOAuthSuccess = () => {
      console.log('OAuth success detected, refreshing connection status...');
      setTimeout(() => {
        checkConnection();
        fetchAccounts();
      }, 1000);
    };

    // Listen for the OAuth success event from the callback page
    window.addEventListener('google-oauth-success', handleOAuthSuccess);
    
    // Also check when the page becomes visible again (user returns from OAuth)
    const handleVisibilityChange = () => {
      if (!document.hidden && !connected) {
        console.log('Page became visible, checking for new connection...');
        setTimeout(() => {
          checkConnection();
          fetchAccounts();
        }, 1000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('google-oauth-success', handleOAuthSuccess);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [connected]);

  async function checkConnection() {
    if (!user) return;
    
    console.log('Checking Google Ads connection status...');
    
    try {
      const { data, error } = await supabase
        .from('api_tokens')
        .select('*')
        .eq('user_id', user.id)
        .eq('provider', 'google')
        .maybeSingle();
      
      console.log('Connection check result:', { data, error });
      
      if (data && !error) {
        setConnected(true);
        setConfigError(null);
        console.log('Google Ads connection found');
        
        // Dispatch event to notify other components
        window.dispatchEvent(new CustomEvent('google-ads-connected', { detail: data }));
      } else {
        setConnected(false);
        console.log('No Google Ads connection found');
      }
    } catch (error) {
      console.error("Error checking connection:", error);
      setConnected(false);
    }
  }

  async function fetchAccounts() {
    if (!user) return;
    
    console.log('Fetching Google Ads accounts...');
    
    try {
      const { data, error } = await supabase
        .from('ad_accounts')
        .select('*')
        .eq('user_id', user.id)
        .eq('platform', 'google');
      
      console.log('Accounts fetch result:', { data, error });
      
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        const accountsData = data.map(account => ({
          id: account.account_id,
          name: account.account_name || `Account ${account.account_id}`
        }));
        
        console.log('Found Google Ads accounts:', accountsData);
        setAccounts(accountsData);
        
        // If there's a previously selected account in localStorage, use that
        const savedAccountId = localStorage.getItem('selectedGoogleAdsAccount');
        if (savedAccountId && accountsData.length > 0) {
          const savedAccount = accountsData.find(acc => acc.id === savedAccountId);
          if (savedAccount) {
            setSelectedAccount(savedAccount.id);
          } else {
            // If saved account not found, use the first account
            setSelectedAccount(accountsData[0].id);
            localStorage.setItem('selectedGoogleAdsAccount', accountsData[0].id);
          }
        } else if (accountsData.length > 0) {
          // If no saved account, default to first
          setSelectedAccount(accountsData[0].id);
          localStorage.setItem('selectedGoogleAdsAccount', accountsData[0].id);
        }

        // Dispatch event with account data for other components to use
        window.dispatchEvent(new CustomEvent('google-ads-accounts-loaded', { 
          detail: { accounts: accountsData, selectedAccount: accountsData[0]?.id } 
        }));
      } else {
        console.log('No Google Ads accounts found in database');
        setAccounts([]);
      }
    } catch (error) {
      console.error('Error fetching Google Ads accounts:', error);
      toast.error('Failed to fetch Google Ads accounts');
    }
  }

  const handleConnect = async () => {
    try {
      setConfigError(null);
      setLoading(true);
      
      console.log('Starting Google Ads OAuth flow...');
      
      // Generate a random state for OAuth security
      const state = Math.random().toString(36).substring(2);
      // Save the state in localStorage to verify later
      localStorage.setItem('googleOAuthState', state);
      
      // Use the current domain for redirect URI
      const redirectUri = window.location.origin + '/google-callback';
      
      console.log('OAuth parameters:', { redirectUri, state });
      console.log('Current domain:', window.location.origin);
      
      // Call our secure edge function to get the proper client ID
      console.log("Getting Google client ID from edge function");
      const { data: clientData, error: clientError } = await supabase.functions.invoke('google-ads-auth', {
        body: { 
          action: 'get_client_id'
        }
      });
      
      if (clientError || !clientData?.clientId) {
        console.error("Failed to get client ID:", clientError, clientData);
        throw new Error('Could not retrieve Google Client ID. Please check your configuration.');
      }
      
      const clientId = clientData.clientId;
      const scope = encodeURIComponent('https://www.googleapis.com/auth/adwords');
      
      console.log("Starting Google OAuth with client ID:", clientId.substring(0, 8) + '...');
      
      // Construct the OAuth URL with all required parameters
      const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&state=${state}&access_type=offline&prompt=consent&include_granted_scopes=true`;
      
      console.log('Redirecting to OAuth URL with redirect URI:', redirectUri);
      
      // Redirect to Google's OAuth page
      window.location.href = oauthUrl;
    } catch (error) {
      console.error("Error initiating Google OAuth:", error);
      setConfigError((error as Error).message || "OAuth initialization failed. Check console for details.");
      toast.error("Failed to connect to Google Ads");
    } finally {
      setLoading(false);
    }
  };
  
  const handleRefreshAccounts = async () => {
    setRefreshing(true);
    await checkConnection();
    await fetchAccounts();
    setRefreshing(false);
    toast.success('Account data refreshed');
  };
  
  const handleSelectAccount = (accountId: string) => {
    setSelectedAccount(accountId);
    localStorage.setItem('selectedGoogleAdsAccount', accountId);
    
    // Find the selected account to show in toast
    const account = accounts.find(acc => acc.id === accountId);
    if (account) {
      toast.success(`Selected account: ${account.name}`);
      
      // Dispatch event to notify other components of account selection
      window.dispatchEvent(new CustomEvent('google-ads-account-selected', { 
        detail: { accountId, accountName: account.name } 
      }));
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Google Ads Integration</CardTitle>
        <CardDescription>Connect to your Google Ads accounts</CardDescription>
      </CardHeader>
      <CardContent>
        {!connected ? (
          <div>
            <p className="mb-4 text-sm text-muted-foreground">
              Connect your Google Ads account to view and analyze your campaigns, keywords, and performance data.
            </p>
            {configError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-start gap-2 text-red-700">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium">Configuration Error</p>
                    <p>{configError}</p>
                    <div className="mt-2 text-xs">
                      <p className="font-medium">Current redirect URI should be:</p>
                      <code className="bg-red-100 px-1 py-0.5 rounded text-red-800">{window.location.origin}/google-callback</code>
                      <p className="mt-2 font-medium">To fix this:</p>
                      <ol className="list-decimal pl-4 mt-1 space-y-1">
                        <li>Go to your Google Cloud Console</li>
                        <li>Navigate to APIs & Services → Credentials</li>
                        <li>Edit your OAuth 2.0 Client ID</li>
                        <li>Update the redirect URI to: <code className="bg-gray-100 px-1 py-0.5 rounded">{window.location.origin}/google-callback</code></li>
                        <li>Save and try connecting again</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <Button 
              onClick={handleConnect} 
              disabled={loading}
              className="gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                'Connect Google Ads'
              )}
            </Button>
            <div className="mt-4 text-xs text-muted-foreground">
              <p className="font-medium mb-1">Setup Requirements:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Google Ads API must be enabled in Google Cloud Console</li>
                <li>OAuth consent screen must be configured</li>
                <li>Current redirect URI: <code className="bg-blue-100 px-1 py-0.5 text-blue-800">{window.location.origin}/google-callback</code></li>
              </ul>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-green-500 flex items-center gap-2">
                <Check className="h-4 w-4" />
                Connected to Google Ads
              </span>
              <Button 
                onClick={handleRefreshAccounts} 
                size="sm" 
                variant="outline"
                disabled={refreshing}
                className="gap-2"
              >
                {refreshing ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Refreshing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-3 w-3" />
                    Refresh Accounts
                  </>
                )}
              </Button>
            </div>
            
            {accounts.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Select Google Ads Account</h3>
                <Select 
                  value={selectedAccount || undefined}
                  onValueChange={handleSelectAccount}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select an account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name} ({account.id})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {selectedAccount && (
              <div className="mb-4 bg-primary/10 p-3 rounded-md">
                <p className="text-sm font-medium">Current Selection:</p>
                <h4 className="text-lg font-bold">
                  {accounts.find(a => a.id === selectedAccount)?.name}
                </h4>
                <p className="text-xs text-muted-foreground">ID: {selectedAccount}</p>
              </div>
            )}
            
            {accounts.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Selected</TableHead>
                    <TableHead>Account ID</TableHead>
                    <TableHead>Account Name</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accounts.map((account) => (
                    <TableRow 
                      key={account.id}
                      className={selectedAccount === account.id ? "bg-muted/80" : ""}
                      onClick={() => handleSelectAccount(account.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <TableCell>
                        {selectedAccount === account.id && (
                          <Check className="h-4 w-4 text-green-500" />
                        )}
                      </TableCell>
                      <TableCell>{account.id}</TableCell>
                      <TableCell>{account.name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No Google Ads accounts found</p>
                <p className="text-sm text-muted-foreground">
                  Make sure you have access to Google Ads accounts with the email you used to sign in.
                </p>
                <Button 
                  onClick={handleRefreshAccounts} 
                  className="mt-4"
                  variant="outline"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Accounts
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default GoogleAdsIntegration;
