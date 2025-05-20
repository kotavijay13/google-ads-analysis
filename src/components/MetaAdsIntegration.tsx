
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2 } from 'lucide-react';

interface MetaAdsAccount {
  id: string;
  name: string;
}

const MetaAdsIntegration = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<MetaAdsAccount[]>([]);
  const [connected, setConnected] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<MetaAdsAccount | null>(null);

  useEffect(() => {
    if (user) {
      checkConnection();
      fetchAccounts();
    }
  }, [user]);

  const checkConnection = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('api_tokens')
      .select('*')
      .eq('user_id', user.id)
      .eq('provider', 'meta')
      .single();
    
    if (data) {
      setConnected(true);
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
        .eq('platform', 'meta');
      
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
        const savedAccountId = localStorage.getItem('selectedMetaAccount');
        if (savedAccountId && accountsData.length > 0) {
          const savedAccount = accountsData.find(acc => acc.id === savedAccountId);
          if (savedAccount) {
            setSelectedAccount(savedAccount);
          } else {
            // If saved account not found, use the first account
            setSelectedAccount(accountsData[0]);
            localStorage.setItem('selectedMetaAccount', accountsData[0].id);
          }
        } else if (accountsData.length > 0) {
          // If no saved account, default to first
          setSelectedAccount(accountsData[0]);
          localStorage.setItem('selectedMetaAccount', accountsData[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching Meta Ads accounts:', error);
      toast.error('Failed to fetch Meta Ads accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    // Generate a random state for OAuth security
    const state = Math.random().toString(36).substring(2);
    // Save the state in localStorage to verify later
    localStorage.setItem('metaOAuthState', state);
    
    // Create the OAuth URL using the environment variable
    const oauthEndpoint = 'https://www.facebook.com/v19.0/dialog/oauth';
    const clientId = '374929952003490'; // Using the actual client ID
    const redirectUri = window.location.origin + '/meta-callback';
    const scope = 'ads_management,ads_read';
    
    // Construct the OAuth URL
    const oauthUrl = `${oauthEndpoint}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&state=${state}`;
    
    // Redirect to Meta's OAuth page
    window.location.href = oauthUrl;
  };

  const handleSelectAccount = (account: MetaAdsAccount) => {
    setSelectedAccount(account);
    localStorage.setItem('selectedMetaAccount', account.id);
    toast.success(`Meta Ads account "${account.name}" selected`);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Meta Ads Integration</CardTitle>
        <CardDescription>Connect to your Meta Ads accounts</CardDescription>
      </CardHeader>
      <CardContent>
        {!connected ? (
          <Button onClick={handleConnect}>Connect Meta Ads</Button>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-green-500">Connected</span>
              <Button onClick={fetchAccounts} size="sm">Refresh Accounts</Button>
            </div>
            
            {selectedAccount && (
              <div className="mb-4 bg-primary/10 p-3 rounded-md flex justify-between items-center">
                <div>
                  <span className="text-sm font-medium">Selected Account:</span>
                  <h3 className="text-md font-bold">{selectedAccount.name}</h3>
                  <p className="text-xs text-muted-foreground">ID: {selectedAccount.id}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => fetchAccounts()}>
                  Change
                </Button>
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
                    <TableHead>Account ID</TableHead>
                    <TableHead>Account Name</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accounts.map((account) => (
                    <TableRow key={account.id} className={selectedAccount?.id === account.id ? "bg-muted/80" : ""}>
                      <TableCell>{account.id}</TableCell>
                      <TableCell>{account.name}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant={selectedAccount?.id === account.id ? "default" : "outline"} 
                          size="sm"
                          onClick={() => handleSelectAccount(account)}
                          disabled={selectedAccount?.id === account.id}
                        >
                          {selectedAccount?.id === account.id ? "Selected" : "Select"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center text-muted-foreground my-4">No Meta Ads accounts found</p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MetaAdsIntegration;
