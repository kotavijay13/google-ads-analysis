
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import { Globe } from 'lucide-react';
import { WebsiteForm } from './types';

interface WebsiteScannerProps {
  onFormsDetected: (forms: WebsiteForm[], websiteUrl: string) => void;
}

const WebsiteScanner = ({ onFormsDetected }: WebsiteScannerProps) => {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const scanWebsiteForms = async () => {
    if (!websiteUrl) {
      toast.error("Please enter a website URL");
      return;
    }

    // Validate URL format
    let validUrl = websiteUrl;
    if (!websiteUrl.startsWith('http://') && !websiteUrl.startsWith('https://')) {
      validUrl = 'https://' + websiteUrl;
    }

    setIsScanning(true);
    
    // Simulate form detection with real URLs from the input website
    setTimeout(() => {
      const mockForms: WebsiteForm[] = [
        {
          id: 'contact-form',
          name: 'Contact Form',
          url: validUrl + '/contact',
          fields: [
            { name: 'full_name', type: 'text', required: true },
            { name: 'email_address', type: 'email', required: true },
            { name: 'phone_number', type: 'tel', required: false },
            { name: 'message', type: 'textarea', required: true }
          ]
        },
        {
          id: 'newsletter-form',
          name: 'Newsletter Signup',
          url: validUrl + '/newsletter',
          fields: [
            { name: 'email', type: 'email', required: true },
            { name: 'first_name', type: 'text', required: false }
          ]
        }
      ];
      
      onFormsDetected(mockForms, validUrl);
      setIsScanning(false);
      toast.success(`Found ${mockForms.length} forms on the website`);
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Globe className="mr-2 h-5 w-5" />
          Connect Website Forms
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <Label htmlFor="websiteUrl">Website URL</Label>
            <Input
              id="websiteUrl"
              placeholder="yourwebsite.com or https://yourwebsite.com"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <Button 
              onClick={scanWebsiteForms} 
              disabled={isScanning}
              className="min-w-[120px]"
            >
              {isScanning ? "Scanning..." : "Scan Forms"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WebsiteScanner;
