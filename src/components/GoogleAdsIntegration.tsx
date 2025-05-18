
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2 } from 'lucide-react';

interface GoogleAdsAccount {
  id: string;
  name: string;
}

const GoogleAdsIntegration = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<GoogleAdsAccount[]>([]);
  const [connected, setConnected] = useState(false);

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
      .eq('provider', 'google')
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
        .eq('platform', 'google');
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setAccounts(data.map(account => ({
          id: account.account_id,
          name: account.account_name || account.account_id
        })));
      }
    } catch (error) {
      console.error('Error fetching Google Ads accounts:', error);
      toast.error('Failed to fetch Google Ads accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    // Generate a random state for OAuth security
    const state = Math.random().toString(36).substring(2);
    // Save the state in localStorage to verify later
    localStorage.setItem('googleOAuthState', state);
    
    // Using the correct OAuth configuration
    const oauthEndpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
    // Use web application client ID (not Android)
    const clientId = '174740180735-pq1vkuf06dpu1n0n708iugi20rkupf49.apps.googleusercontent.com';
    // Make sure redirect URI matches exactly what's configured in Google Cloud Console
    const redirectUri = encodeURIComponent(window.location.origin + '/google-callback');
    const scope = encodeURIComponent('https://www.googleapis.com/auth/adwords');
    
    // Construct the OAuth URL with all required parameters
    const oauthUrl = `${oauthEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}&access_type=offline&prompt=consent&include_granted_scopes=true`;
    
    // Redirect to Google's OAuth page
    window.location.href = oauthUrl;
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
            <Button onClick={handleConnect}>Connect Google Ads</Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-green-500">Connected</span>
              <Button onClick={fetchAccounts} size="sm">Refresh Accounts</Button>
            </div>
            
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accounts.map((account) => (
                    <TableRow key={account.id}>
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
