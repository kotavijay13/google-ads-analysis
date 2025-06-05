
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/sonner';

const FormsPage = () => {
  const [activeTab, setActiveTab] = useState('website-forms');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [facebookPageId, setFacebookPageId] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const handleWebsiteConnect = async () => {
    if (!websiteUrl.trim()) {
      toast.error('Please enter a website URL');
      return;
    }
    
    setIsConnecting(true);
    try {
      // Simulate connection process
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(`Successfully connected to ${websiteUrl}`);
      setWebsiteUrl('');
    } catch (error) {
      toast.error('Failed to connect to website');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleFacebookConnect = async () => {
    if (!facebookPageId.trim()) {
      toast.error('Please enter a Facebook Page ID');
      return;
    }
    
    setIsConnecting(true);
    try {
      // Simulate connection process
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(`Successfully connected to Facebook Page: ${facebookPageId}`);
      setFacebookPageId('');
    } catch (error) {
      toast.error('Failed to connect to Facebook page');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Forms Management</h1>
        <p className="text-muted-foreground">Connect and manage your website and social media forms</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="website-forms">Website Forms</TabsTrigger>
          <TabsTrigger value="facebook-forms">Facebook Forms</TabsTrigger>
        </TabsList>

        <TabsContent value="website-forms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Connect Website Forms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="website-url">Website URL</Label>
                <Input
                  id="website-url"
                  placeholder="Enter your website URL (e.g., example.com)"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="form-type">Form Type</Label>
                <Select defaultValue="contact-form">
                  <SelectTrigger>
                    <SelectValue placeholder="Select form type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="contact-form">Contact Form</SelectItem>
                    <SelectItem value="lead-form">Lead Generation Form</SelectItem>
                    <SelectItem value="newsletter">Newsletter Signup</SelectItem>
                    <SelectItem value="custom">Custom Form</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="form-description">Description (Optional)</Label>
                <Textarea
                  id="form-description"
                  placeholder="Describe what this form is used for..."
                  rows={3}
                />
              </div>

              <Button 
                onClick={handleWebsiteConnect}
                disabled={isConnecting}
                className="w-full"
              >
                {isConnecting ? 'Connecting...' : 'Connect Website Form'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Connected Website Forms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>No website forms connected yet.</p>
                <p className="text-sm">Connect your first website form above to get started.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="facebook-forms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Connect Facebook Lead Forms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="facebook-page">Facebook Page ID</Label>
                <Input
                  id="facebook-page"
                  placeholder="Enter your Facebook Page ID"
                  value={facebookPageId}
                  onChange={(e) => setFacebookPageId(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="campaign-type">Campaign Type</Label>
                <Select defaultValue="lead-generation">
                  <SelectTrigger>
                    <SelectValue placeholder="Select campaign type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lead-generation">Lead Generation</SelectItem>
                    <SelectItem value="brand-awareness">Brand Awareness</SelectItem>
                    <SelectItem value="traffic">Traffic</SelectItem>
                    <SelectItem value="conversions">Conversions</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleFacebookConnect}
                disabled={isConnecting}
                className="w-full"
              >
                {isConnecting ? 'Connecting...' : 'Connect Facebook Form'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Connected Facebook Forms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>No Facebook forms connected yet.</p>
                <p className="text-sm">Connect your first Facebook form above to get started.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FormsPage;
