
import { Button } from '@/components/ui/button';
import { Loader2, LinkIcon, AlertCircle, ExternalLink } from 'lucide-react';

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
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex items-center text-red-500 text-sm">
            <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Make sure your Google Search Console API is enabled and properly configured.
          </div>
          <a 
            href="https://console.cloud.google.com/apis/library/webmasters.googleapis.com" 
            target="_blank"
            rel="noopener noreferrer" 
            className="text-xs text-blue-500 hover:text-blue-700 flex items-center"
          >
            Enable Search Console API <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        </div>
      )}
      
      <div className="bg-muted/50 p-4 rounded-md mt-4">
        <h4 className="text-sm font-medium mb-2">Important Notes:</h4>
        <ul className="text-xs text-muted-foreground list-disc pl-4 space-y-1">
          <li>Make sure your Google account has access to Search Console properties.</li>
          <li>You'll be redirected to Google to authorize access.</li>
          <li>The Google Search Console API must be enabled in your Google Cloud project.</li>
          <li>Verify that the OAuth consent screen is properly configured.</li>
          <li>After connecting, you can add or select properties to view their data.</li>
        </ul>
      </div>
    </div>
  );
};

export default ConnectButton;
