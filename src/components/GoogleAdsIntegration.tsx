
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Check, AlertCircle } from 'lucide-react';
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

  const checkConnection = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('api_tokens')
        .select('*')
        .eq('user_id', user.id)
        .eq('provider', 'google')
        .single();
      
      if (data) {
        setConnected(true);
        setConfigError(null);
      }
    } catch (error) {
      console.error("Error checking connection:", error);
    }
  };

  const fetchAccounts = async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('ad_accounts')
        .select('*')
        .eq('user_id', user.id)
        .eq('platform', 'google');
      
      if (error) {
        throw error;
      }
      
      if (data) {
        const accountsData = data.map(account => ({
          id: account.account_id,
          name: account.account_name || account.account_id
        }));
        
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
      }
    } catch (error) {
      console.error('Error fetching Google Ads accounts:', error);
      toast.error('Failed to fetch Google Ads accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      setConfigError(null);
      setLoading(true);
      
      // Generate a random state for OAuth security
      const state = Math.random().toString(36).substring(2);
      // Save the state in localStorage to verify later
      localStorage.setItem('googleOAuthState', state);
      
      // Use the exact redirect URI as configured in Google Cloud Console
      const redirectUri = window.location.origin + '/google-callback';
      
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
      
      console.log("Starting Google OAuth with:", {
        clientId: clientId.substring(0, 8) + '...',
        redirectUri,
        state
      });
      
      // Construct the OAuth URL with all required parameters
      const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&state=${state}&access_type=offline&prompt=consent&include_granted_scopes=true`;
      
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
  
  const handleSelectAccount = (accountId: string) => {
    setSelectedAccount(accountId);
    localStorage.setItem('selectedGoogleAdsAccount', accountId);
    
    // Find the selected account to show in toast
    const account = accounts.find(acc => acc.id === accountId);
    if (account) {
      toast.success(`Selected account: ${account.name}`);
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
                    {configError.includes('redirect') && (
                      <div className="mt-2 text-xs">
                        <p className="font-medium">To fix this:</p>
                        <ol className="list-decimal pl-4 mt-1 space-y-1">
                          <li>Go to your Google Cloud Console</li>
                          <li>Navigate to APIs & Services → Credentials</li>
                          <li>Edit your OAuth 2.0 Client ID</li>
                          <li>Add this redirect URI: <code className="bg-gray-100 px-1 py-0.5 rounded">{window.location.origin}/google-callback</code></li>
                          <li>Save and try connecting again</li>
                        </ol>
                      </div>
                    )}
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
                <li>Redirect URI must be set to: <code className="bg-gray-100 px-1 py-0.5">{window.location.origin}/google-callback</code></li>
              </ul>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-green-500">Connected</span>
              <Button onClick={fetchAccounts} size="sm">Refresh Accounts</Button>
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
                        {account.name}
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
            
            {loading ? (
              <div className="flex justify-center my-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : accounts.length > 0 ? (
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
              <p className="text-center text-muted-foreground my-4">No Google Ads accounts found</p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default GoogleAdsIntegration;
