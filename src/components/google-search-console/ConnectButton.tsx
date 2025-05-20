
import { Button } from '@/components/ui/button';
import { Loader2, LinkIcon } from 'lucide-react';

interface ConnectButtonProps {
  isLoading: boolean;
  onConnect: () => Promise<void>;
}

const ConnectButton = ({ isLoading, onConnect }: ConnectButtonProps) => {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Connect your Google account to import Search Console data and see website performance metrics.
      </p>
      <Button 
        onClick={onConnect}
        disabled={isLoading}
        className="gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <LinkIcon className="h-4 w-4" />
            Connect with Google
          </>
        )}
      </Button>
    </div>
  );
};

export default ConnectButton;
