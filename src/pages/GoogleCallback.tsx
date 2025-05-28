
import { Card, CardContent } from '@/components/ui/card';
import { useOAuthCallback } from './google-callback/useOAuthCallback';
import ProcessingState from './google-callback/ProcessingState';
import ErrorState from './google-callback/ErrorState';
import SuccessState from './google-callback/SuccessState';
import { useEffect } from 'react';

const GoogleCallback = () => {
  const { processing, errorMessage, errorDetails, authType } = useOAuthCallback();

  useEffect(() => {
    console.log('GoogleCallback component mounted');
    console.log('Current URL:', window.location.href);
    console.log('URL search params:', window.location.search);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
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
