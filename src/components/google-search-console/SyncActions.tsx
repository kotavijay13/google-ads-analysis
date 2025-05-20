
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface SyncActionsProps {
  isLoading: boolean;
  selectedProperty: string | null;
  onSync: () => Promise<void>;
}

const SyncActions = ({ isLoading, selectedProperty, onSync }: SyncActionsProps) => {
  return (
    <div className="flex justify-between items-center mt-4">
      <span className="text-sm text-muted-foreground">
        Last sync: {new Date().toLocaleString()}
      </span>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onSync}
        disabled={isLoading || !selectedProperty}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Syncing...
          </>
        ) : (
          "Sync data"
        )}
      </Button>
    </div>
  );
};

export default SyncActions;
