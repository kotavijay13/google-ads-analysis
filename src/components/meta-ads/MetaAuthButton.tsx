
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { AlertCircle } from 'lucide-react';

interface MetaAuthButtonProps {
  connected: boolean;
  onConnect: () => void;
  onRefreshAccounts: () => void;
  error?: string | null;
}

const MetaAuthButton = ({
  connected,
  onConnect,
  onRefreshAccounts,
  error: externalError
}: MetaAuthButtonProps) => {
  const [internalError, setInternalError] = useState<string | null>(null);
  
  const handleConnect = () => {
    // Reset any previous errors
    setInternalError(null);
    // Call parent's onConnect function
    try {
      onConnect();
    } catch (err) {
      setInternalError('Failed to connect to Meta. Please try again.');
      console.error('Meta connect error:', err);
    }
  };

  // Determine which error to show - external takes precedence
  const errorToShow = externalError || internalError;

  if (!connected) {
    return (
      <div>
        <Button onClick={handleConnect}>Connect Meta Ads</Button>
        {errorToShow && (
          <div className="flex items-center mt-2 text-red-500 text-sm">
            <AlertCircle className="h-4 w-4 mr-1" />
            <span>{errorToShow}</span>
          </div>
        )}
        <p className="mt-3 text-xs text-muted-foreground">
          You'll be redirected to Facebook to authorize access to your Meta Ads accounts.
          <br />
          Make sure you've created a Meta for Developers app and configured it properly.
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
