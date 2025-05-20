
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { AlertCircle } from 'lucide-react';

interface MetaAuthButtonProps {
  connected: boolean;
  onConnect: () => void;
  onRefreshAccounts: () => void;
}

const MetaAuthButton = ({
  connected,
  onConnect,
  onRefreshAccounts
}: MetaAuthButtonProps) => {
  const [error, setError] = useState<string | null>(null);
  
  const handleConnect = () => {
    // Reset any previous errors
    setError(null);
    // Call parent's onConnect function
    try {
      onConnect();
    } catch (err) {
      setError('Failed to connect to Meta. Please try again.');
      console.error('Meta connect error:', err);
    }
  };

  if (!connected) {
    return (
      <div>
        <Button onClick={handleConnect}>Connect Meta Ads</Button>
        {error && (
          <div className="flex items-center mt-2 text-red-500 text-sm">
            <AlertCircle className="h-4 w-4 mr-1" />
            <span>{error}</span>
          </div>
        )}
        <p className="mt-3 text-xs text-muted-foreground">
          You'll be redirected to Facebook to authorize access to your Meta Ads accounts.
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between mb-4">
      <span className="text-sm font-medium text-green-500">Connected</span>
      <Button onClick={onRefreshAccounts} size="sm">Refresh Accounts</Button>
    </div>
  );
};

export default MetaAuthButton;
