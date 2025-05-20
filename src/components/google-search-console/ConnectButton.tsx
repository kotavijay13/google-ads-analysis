
import { Button } from '@/components/ui/button';
import { Loader2, LinkIcon, AlertCircle } from 'lucide-react';

interface ConnectButtonProps {
  isLoading: boolean;
  onConnect: () => Promise<void>;
  error?: string | null;
}

const ConnectButton = ({ isLoading, onConnect, error }: ConnectButtonProps) => {
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
      
      {error && (
        <div className="flex items-center mt-2 text-red-500 text-sm">
          <AlertCircle className="h-4 w-4 mr-1" />
          <span>{error}</span>
        </div>
      )}
      
      <div className="bg-muted/50 p-4 rounded-md mt-4">
        <h4 className="text-sm font-medium mb-2">Important Notes:</h4>
        <ul className="text-xs text-muted-foreground list-disc pl-4 space-y-1">
          <li>Make sure your Google account has access to Search Console properties.</li>
          <li>You'll be redirected to Google to authorize access.</li>
          <li>After connecting, you can add or select properties to view their data.</li>
        </ul>
      </div>
    </div>
  );
};

export default ConnectButton;
