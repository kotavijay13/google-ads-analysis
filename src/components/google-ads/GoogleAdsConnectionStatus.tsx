
import { Button } from '@/components/ui/button';
import { Check, RefreshCw, Loader2 } from 'lucide-react';

interface GoogleAdsConnectionStatusProps {
  refreshing: boolean;
  onRefreshAccounts: () => void;
}

const GoogleAdsConnectionStatus = ({ refreshing, onRefreshAccounts }: GoogleAdsConnectionStatusProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <span className="text-sm font-medium text-green-500 flex items-center gap-2">
        <Check className="h-4 w-4" />
        Connected to Google Ads
      </span>
      <Button 
        onClick={onRefreshAccounts} 
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
  );
};

export default GoogleAdsConnectionStatus;
