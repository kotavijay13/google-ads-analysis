
import Header from '@/components/Header';
import GoogleAdsIntegration from '@/components/GoogleAdsIntegration';
import MetaAdsIntegration from '@/components/MetaAdsIntegration';
import { Card, CardContent, CardDescription, CardTitle, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const IntegrationsPage = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <Header title="API Integrations" onRefresh={handleRefresh} />
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Manage Data Sources</CardTitle>
          <CardDescription>
            Connect to ad platforms and analytics sources to import your data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-sm">
            <p className="mb-4">
              <strong>Note for Administrators:</strong> This application requires API credentials from Google Cloud and Meta for Developers to be configured in the project's secrets. End-users of this application will not need to create their own developer apps.
            </p>
            <p>
              Once you connect your accounts, you can select specific ad accounts or properties from the dropdown menus.
              Your selection will determine what data is displayed in the corresponding dashboards.
            </p>
          </CardDescription>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="google-ads" className="w-full">
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="google-ads">Google Ads</TabsTrigger>
          <TabsTrigger value="meta-ads">Meta Ads</TabsTrigger>
        </TabsList>
        <TabsContent value="google-ads" className="mt-0">
          <GoogleAdsIntegration />
        </TabsContent>
        <TabsContent value="meta-ads" className="mt-0">
          <MetaAdsIntegration />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntegrationsPage;
