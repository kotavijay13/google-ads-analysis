
import { Button } from '@/components/ui/button';
import { SearchConsoleProperty } from './types';

interface ConnectionStatusProps {
  connected: boolean;
  isLoading: boolean;
  onDisconnect: () => Promise<void>;
}

const ConnectionStatus = ({ connected, isLoading, onDisconnect }: ConnectionStatusProps) => {
  if (!connected) return null;

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-green-500">Connected to Google Search Console</span>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onDisconnect}
        disabled={isLoading}
      >
        Disconnect
      </Button>
    </div>
  );
};

export default ConnectionStatus;
