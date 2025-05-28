
import { Button } from '@/components/ui/button';
import { Check, RefreshCw, Loader2, Sync } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

interface GoogleAdsConnectionStatusProps {
  refreshing: boolean;
  onRefreshAccounts: () => void;
}

const GoogleAdsConnectionStatus = ({ refreshing, onRefreshAccounts }: GoogleAdsConnectionStatusProps) => {
  const [syncing, setSyncing] = useState(false);

  const handleSyncAccounts = async () => {
    setSyncing(true);
    console.log('Starting manual account sync...');
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('No valid session found');
      }

      const { data, error: functionError } = await supabase.functions.invoke('google-ads-auth', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: { 
          action: 'sync_accounts'
        }
      });

      console.log('Manual sync response:', { data, functionError });

      if (functionError) {
        console.error("Manual sync error:", functionError);
        throw new Error(functionError.message || 'Failed to sync accounts');
      }

      if (!data?.success) {
        console.error("Manual sync returned failure:", data);
        throw new Error(data?.error || 'Failed to sync Google Ads accounts');
      }

      toast.success('Accounts synced successfully! Refreshing...');
      
      // Wait a moment then refresh the accounts list
      setTimeout(() => {
        onRefreshAccounts();
      }, 1000);
      
    } catch (error) {
      console.error('Manual sync error:', error);
      toast.error(`Sync failed: ${(error as Error).message}`);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <span className="text-sm font-medium text-green-500 flex items-center gap-2">
        <Check className="h-4 w-4" />
        Connected to Google Ads
      </span>
      <div className="flex gap-2">
        <Button 
          onClick={handleSyncAccounts} 
          size="sm" 
          variant="outline"
          disabled={syncing || refreshing}
          className="gap-2"
        >
          {syncing ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              Syncing...
            </>
          ) : (
            <>
              <Sync className="h-3 w-3" />
              Sync Accounts
            </>
          )}
        </Button>
        <Button 
          onClick={onRefreshAccounts} 
          size="sm" 
          variant="outline"
          disabled={refreshing || syncing}
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
              Refresh
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default GoogleAdsConnectionStatus;
