
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Copy } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { ConnectedForm } from '@/hooks/useConnectedForms';
import ConnectedFormCard from './ConnectedFormCard';

interface ConnectedFormsListProps {
  connectedForms: ConnectedForm[];
  isLoading: boolean;
  onDisconnect: (formId: string) => void;
}

const ConnectedFormsList = ({ connectedForms, isLoading, onDisconnect }: ConnectedFormsListProps) => {
  const copyWebhookUrl = () => {
    // Use the correct Supabase function URL
    const webhookUrl = `https://omgbcuomikauxthmslpi.supabase.co/functions/v1/form-webhook`;
    navigator.clipboard.writeText(webhookUrl);
    toast.success('Webhook URL copied to clipboard');
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Connected Forms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading connected forms...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
          Connected Forms ({connectedForms.length})
        </CardTitle>
        {connectedForms.length > 0 && (
          <Button variant="outline" size="sm" onClick={copyWebhookUrl}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Webhook URL
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {connectedForms.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No forms connected yet.</p>
            <p className="text-sm mt-2">Connect your first form below to start collecting leads.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {connectedForms.map((form) => (
              <ConnectedFormCard 
                key={form.id} 
                form={form} 
                onDisconnect={onDisconnect} 
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConnectedFormsList;
