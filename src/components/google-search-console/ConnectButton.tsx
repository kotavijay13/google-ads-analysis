
import { Button } from '@/components/ui/button';
import { Loader2, LinkIcon, AlertCircle, ExternalLink, Settings } from 'lucide-react';
import { useState } from 'react';

interface ConnectButtonProps {
  isLoading: boolean;
  onConnect: () => Promise<void>;
  error?: string | null;
}

const ConnectButton = ({ isLoading, onConnect, error }: ConnectButtonProps) => {
  const [showRedirectTip, setShowRedirectTip] = useState(false);
  
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
          <div className="flex items-start gap-2 text-red-500 text-sm">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
          
          {error.includes('redirect_uri_mismatch') && (
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-md mt-2">
              <h4 className="text-sm font-medium text-amber-800 flex items-center gap-1 mb-2">
                <Settings className="h-4 w-4" /> OAuth Configuration Issue
              </h4>
              <p className="text-xs text-amber-700 mb-2">
                The redirect URI in your Google Cloud console doesn't match the one being used by this application.
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs"
                onClick={() => setShowRedirectTip(!showRedirectTip)}
              >
                {showRedirectTip ? "Hide Solution" : "Show Solution"}
              </Button>
              
              {showRedirectTip && (
                <div className="mt-2 text-xs space-y-2 bg-white p-2 rounded border border-amber-100">
                  <p className="font-medium">Follow these steps:</p>
                  <ol className="list-decimal pl-4 space-y-1">
                    <li>Go to your <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Cloud Console</a></li>
                    <li>Select your project and find the OAuth 2.0 Client ID being used</li>
                    <li>Add this redirect URI: <code className="bg-gray-100 px-1 py-0.5 rounded">{window.location.origin}/google-callback</code></li>
                    <li>Save your changes and try connecting again</li>
                  </ol>
                </div>
              )}
            </div>
          )}
          
          <div className="text-xs text-muted-foreground">
            Make sure your Google Search Console API is enabled and properly configured.
          </div>
          <div className="flex flex-wrap gap-2">
            <a 
              href="https://console.cloud.google.com/apis/library/webmasters.googleapis.com" 
              target="_blank"
              rel="noopener noreferrer" 
              className="text-xs text-blue-500 hover:text-blue-700 flex items-center"
            >
              Enable Search Console API <ExternalLink className="h-3 w-3 ml-1" />
            </a>
            <a 
              href="https://console.cloud.google.com/apis/credentials" 
              target="_blank"
              rel="noopener noreferrer" 
              className="text-xs text-blue-500 hover:text-blue-700 flex items-center"
            >
              Configure OAuth <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </div>
        </div>
      )}
      
      <div className="bg-muted/50 p-4 rounded-md mt-4">
        <h4 className="text-sm font-medium mb-2">Important Notes:</h4>
        <ul className="text-xs text-muted-foreground list-disc pl-4 space-y-1">
          <li>Make sure your Google account has access to Search Console properties.</li>
          <li>You'll be redirected to Google to authorize access.</li>
          <li>The Google Search Console API must be enabled in your Google Cloud project.</li>
          <li>Verify that the OAuth consent screen is properly configured.</li>
          <li className="font-medium">Your redirect URI must be set to: <code className="bg-gray-100 px-1 py-0.5">{window.location.origin}/google-callback</code></li>
          <li>After connecting, you can add or select properties to view their data.</li>
        </ul>
      </div>
    </div>
  );
};

export default ConnectButton;
