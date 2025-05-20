
import { Button } from '@/components/ui/button';

interface MetaAuthButtonProps {
  connected: boolean;
  onConnect: () => void;
  onRefreshAccounts: () => void;
}

const MetaAuthButton = ({
  connected,
  onConnect,
  onRefreshAccounts
}: MetaAuthButtonProps) => {
  if (!connected) {
    return <Button onClick={onConnect}>Connect Meta Ads</Button>;
  }

  return (
    <div className="flex items-center justify-between mb-4">
      <span className="text-sm font-medium text-green-500">Connected</span>
      <Button onClick={onRefreshAccounts} size="sm">Refresh Accounts</Button>
    </div>
  );
};

export default MetaAuthButton;
