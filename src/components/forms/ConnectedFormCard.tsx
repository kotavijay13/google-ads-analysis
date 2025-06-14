
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle, Trash2, ExternalLink, Copy, Info, AlertTriangle } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { ConnectedForm } from '@/hooks/useConnectedForms';

interface ConnectedFormCardProps {
  form: ConnectedForm;
  onDisconnect: (formId: string) => void;
}

const ConnectedFormCard = ({ form, onDisconnect }: ConnectedFormCardProps) => {

  const copyFormSubmissionCode = (formId: string) => {
    const code = `
// Add this to your form submission handler
// Make sure to prevent the default form submission and use this instead

document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('form'); // Adjust selector as needed
  
  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault(); // Prevent default form submission
      
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      
      console.log('=== FORM SUBMISSION DEBUG ===');
      console.log('Form ID being sent:', '${formId}');
      console.log('Form data being sent:', data);
      console.log('Website URL:', window.location.href);
      
      const payload = {
        formId: '${formId}',
        formData: data,
        websiteUrl: window.location.href
      };
      
      console.log('Full payload:', JSON.stringify(payload, null, 2));
      
      try {
        const response = await fetch('https://omgbcuomikauxthmslpi.supabase.co/functions/v1/form-webhook', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });
        
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        
        const result = await response.json();
        console.log('Webhook response:', result);
        
        if (response.ok) {
          alert('Form submitted successfully! Lead ID: ' + (result.leadId || 'Unknown'));
          form.reset(); // Clear the form
        } else {
          console.error('Webhook error:', result);
          alert('Error submitting form: ' + (result.error || 'Unknown error'));
        }
      } catch (error) {
        console.error('Network error:', error);
        alert('Network error submitting form: ' + error.message);
      }
    });
  } else {
    console.error('No form found on the page. Make sure you have a <form> element.');
  }
});`;
    
    navigator.clipboard.writeText(code.trim());
    toast.success('Integration code copied to clipboard');
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 mb-1">
            {form.form_name}
            <Badge variant="secondary" className="text-xs font-normal">
              <CheckCircle className="mr-1 h-3 w-3 text-green-600" />
              Connected
            </Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">{form.website_url}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDisconnect(form.id)}
          className="text-muted-foreground hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <div>
          <p className="text-sm font-medium mb-2 text-muted-foreground">Field Mappings</p>
          <div className="flex flex-wrap gap-2">
            {form.field_mappings
              .filter(mapping => mapping.leadField && mapping.leadField !== 'none')
              .map((mapping, index) => (
                <Badge key={index} variant="outline">
                  {mapping.websiteField} → {mapping.leadField}
                </Badge>
              ))}
          </div>
        </div>

        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="debug-info">
                <AccordionTrigger>
                    <span className="flex items-center text-sm font-medium">
                        <Info className="mr-2 h-4 w-4"/>
                        Debug Information
                    </span>
                </AccordionTrigger>
                <AccordionContent className="text-xs text-muted-foreground p-4 bg-muted/50 rounded-md">
                     <p className="mb-1"><strong>Form ID:</strong> {form.form_id}</p>
                     <p className="mb-1"><strong>Webhook URL:</strong> https://omgbcuomikauxthmslpi.supabase.co/functions/v1/form-webhook</p>
                     <p><strong>User ID:</strong> {form.user_id}</p>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="integration-instructions">
                <AccordionTrigger>
                     <span className="flex items-center text-sm font-medium">
                        <AlertTriangle className="mr-2 h-4 w-4"/>
                        Integration Instructions
                    </span>
                </AccordionTrigger>
                <AccordionContent className="text-xs text-muted-foreground p-4 bg-muted/50 rounded-md">
                    <ol className="list-decimal list-inside space-y-1">
                        <li>Copy the integration code below.</li>
                        <li>Add it to your website before the closing &lt;/body&gt; tag.</li>
                        <li>Test your form and check browser console for debug info.</li>
                        <li>Contact support if you see any errors.</li>
                    </ol>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter className="flex gap-2">
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
      </CardFooter>
    </Card>
  )
};

export default ConnectedFormCard;
