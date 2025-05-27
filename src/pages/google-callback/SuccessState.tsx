
import { Button } from '@/components/ui/button';
import { getServiceName, getTargetPage } from './utils';
import { useNavigate } from 'react-router-dom';

interface SuccessStateProps {
  authType: 'search-console' | 'ads';
}

const SuccessState = ({ authType }: SuccessStateProps) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="text-green-500 bg-green-50 p-2 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold mt-4">Authentication Successful</h2>
      <p className="text-muted-foreground mt-2">Successfully connected to {getServiceName(authType)}!</p>
      <Button className="mt-6" onClick={() => navigate(getTargetPage(authType))}>
        Go to {authType === 'ads' ? 'Integrations' : 'Search Console Dashboard'}
      </Button>
    </>
  );
};

export default SuccessState;
