
import Header from '@/components/Header';
import GoogleAdsIntegration from '@/components/GoogleAdsIntegration';
import MetaAdsIntegration from '@/components/MetaAdsIntegration';
import GoogleSearchConsoleIntegration from '@/components/GoogleSearchConsoleIntegration';
import { Card, CardContent, CardDescription } from '@/components/ui/card';

const IntegrationsPage = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <Header title="API Integrations" onRefresh={handleRefresh} />
      
      <Card className="mb-8">
        <CardContent className="pt-6">
          <CardDescription className="text-sm">
            <p className="mb-4">
              <strong>Important Note for App Users:</strong> You do not need to create Google Cloud or Meta developer apps.
              Merge Insights AI allows you to simply log in with your existing Google/Meta accounts to access your ad accounts.
            </p>
            <p>
              Once you connect your accounts using the buttons below, this dashboard will pull and display 
              all ad accounts associated with your Google and Meta accounts automatically.
            </p>
          </CardDescription>
        </CardContent>
      </Card>
      
      <div className="grid gap-8 mt-8">
        <GoogleAdsIntegration />
        <GoogleSearchConsoleIntegration />
        <MetaAdsIntegration />
      </div>
    </div>
  );
};

export default IntegrationsPage;
