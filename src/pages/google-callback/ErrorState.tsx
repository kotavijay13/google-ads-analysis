
import { AlertCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { goToIntegrations, goToGoogleCloudConsole, getServiceName } from './utils';
import { useNavigate } from 'react-router-dom';

interface ErrorStateProps {
  errorMessage: string;
  errorDetails: string | null;
  authType: 'search-console' | 'ads';
}

const ErrorState = ({ errorMessage, errorDetails, authType }: ErrorStateProps) => {
  const navigate = useNavigate();

  return (
    <>
      <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
      <h2 className="text-xl font-semibold mt-4 text-red-500">Authentication Failed</h2>
      <p className="text-muted-foreground mt-2">{errorMessage}</p>
      
      {errorDetails && (
        <div className="mt-4 bg-slate-100 p-3 rounded-md w-full overflow-x-auto max-h-40">
          <pre className="text-xs text-slate-700">{errorDetails}</pre>
        </div>
      )}
      
      <div className="flex flex-col gap-3 mt-6 w-full">
        <Button variant="outline" onClick={() => goToIntegrations(navigate)}>
          Return to Integrations
        </Button>
        <Button 
          variant="outline" 
          onClick={goToGoogleCloudConsole}
          className="flex items-center justify-center gap-1"
        >
          <span>Google Cloud Console</span>
          <ExternalLink className="h-3 w-3" />
        </Button>
      </div>
      
      <div className="mt-6 text-xs text-muted-foreground">
        <p className="font-medium">Troubleshooting Tips:</p>
        <ul className="list-disc pl-4 mt-1 space-y-1">
          <li>Verify {getServiceName(authType)} API is enabled</li>
          <li>Check OAuth consent screen configuration</li>
          <li>Ensure redirect URIs are properly set to: <code className="bg-gray-100 px-1 py-0.5">{window.location.origin}/google-callback</code></li>
          <li>Confirm client ID and secret are correctly configured</li>
        </ul>
      </div>
    </>
  );
};

export default ErrorState;
