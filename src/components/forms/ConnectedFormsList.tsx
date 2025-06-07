
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Trash2, ExternalLink, Copy } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { ConnectedForm } from '@/hooks/useConnectedForms';

interface ConnectedFormsListProps {
  connectedForms: ConnectedForm[];
  isLoading: boolean;
  onDisconnect: (formId: string) => void;
}

const ConnectedFormsList = ({ connectedForms, isLoading, onDisconnect }: ConnectedFormsListProps) => {
  const copyWebhookUrl = () => {
    const webhookUrl = `${window.location.origin}/functions/v1/form-webhook`;
    navigator.clipboard.writeText(webhookUrl);
    toast.success('Webhook URL copied to clipboard');
  };

  const copyFormSubmissionCode = (formId: string) => {
    const code = `
// Add this to your form submission handler
const formData = new FormData(form);
const data = Object.fromEntries(formData.entries());

fetch('${window.location.origin}/functions/v1/form-webhook', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    formId: '${formId}',
    formData: data,
    websiteUrl: window.location.href
  })
});`;
    
    navigator.clipboard.writeText(code);
    toast.success('Form submission code copied to clipboard');
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
              <div key={form.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{form.form_name}</h4>
                      <Badge variant="secondary" className="text-xs">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Connected
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{form.form_url}</p>
                    <p className="text-xs text-muted-foreground mb-3">
                      Website: {form.website_url}
                    </p>
                    
                    <div className="mb-3">
                      <p className="text-sm font-medium mb-2">Field Mappings:</p>
                      <div className="flex flex-wrap gap-1">
                        {form.field_mappings
                          .filter(mapping => mapping.leadField && mapping.leadField !== 'none')
                          .map((mapping, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {mapping.websiteField} → {mapping.leadField}
                            </Badge>
                          ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyFormSubmissionCode(form.form_id)}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Integration Code
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(form.form_url, '_blank')}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Form
                      </Button>
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDisconnect(form.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConnectedFormsList;
