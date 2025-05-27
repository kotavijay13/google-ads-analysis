
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle } from 'lucide-react';

interface GoogleAdsAuthButtonProps {
  loading: boolean;
  configError: string | null;
  onConnect: () => void;
}

const GoogleAdsAuthButton = ({ loading, configError, onConnect }: GoogleAdsAuthButtonProps) => {
  return (
    <div>
      <p className="mb-4 text-sm text-muted-foreground">
        Connect your Google Ads account to view and analyze your campaigns, keywords, and performance data.
      </p>
      {configError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-start gap-2 text-red-700">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium">Configuration Error</p>
              <p>{configError}</p>
              <div className="mt-2 text-xs">
                <p className="font-medium">Current redirect URI should be:</p>
                <code className="bg-red-100 px-1 py-0.5 rounded text-red-800">{window.location.origin}/google-callback</code>
                <p className="mt-2 font-medium">To fix this:</p>
                <ol className="list-decimal pl-4 mt-1 space-y-1">
                  <li>Go to your Google Cloud Console</li>
                  <li>Navigate to APIs & Services → Credentials</li>
                  <li>Edit your OAuth 2.0 Client ID</li>
                  <li>Update the redirect URI to: <code className="bg-gray-100 px-1 py-0.5 rounded">{window.location.origin}/google-callback</code></li>
                  <li>Save and try connecting again</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}
      <Button 
        onClick={onConnect} 
        disabled={loading}
        className="gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Connecting...
          </>
        ) : (
          'Connect Google Ads'
        )}
      </Button>
      <div className="mt-4 text-xs text-muted-foreground">
        <p className="font-medium mb-1">Setup Requirements:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>Google Ads API must be enabled in Google Cloud Console</li>
          <li>OAuth consent screen must be configured</li>
          <li>Current redirect URI: <code className="bg-blue-100 px-1 py-0.5 text-blue-800">{window.location.origin}/google-callback</code></li>
        </ul>
      </div>
    </div>
  );
};

export default GoogleAdsAuthButton;
