
import { Card, CardContent } from '@/components/ui/card';
import { useOAuthCallback } from './google-callback/useOAuthCallback';
import ProcessingState from './google-callback/ProcessingState';
import ErrorState from './google-callback/ErrorState';
import SuccessState from './google-callback/SuccessState';

const GoogleCallback = () => {
  const { processing, errorMessage, errorDetails, authType } = useOAuthCallback();

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center p-6">
          {processing ? (
            <ProcessingState authType={authType} />
          ) : errorMessage ? (
            <ErrorState 
              errorMessage={errorMessage} 
              errorDetails={errorDetails} 
              authType={authType} 
            />
          ) : (
            <SuccessState authType={authType} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleCallback;
