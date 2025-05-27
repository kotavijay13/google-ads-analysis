
import { Loader2 } from 'lucide-react';
import { getServiceName } from './utils';

interface ProcessingStateProps {
  authType: 'search-console' | 'ads';
}

const ProcessingState = ({ authType }: ProcessingStateProps) => {
  return (
    <>
      <Loader2 className="h-8 w-8 animate-spin mb-2" />
      <h2 className="text-xl font-semibold mt-4">Processing Google Authentication</h2>
      <p className="text-muted-foreground mt-2">
        Please wait while we connect your {getServiceName(authType)} account...
      </p>
    </>
  );
};

export default ProcessingState;
