
import { Card, CardContent } from '@/components/ui/card';
import { Globe } from 'lucide-react';

interface GoogleAdsNotificationProps {
  googleAdsConnected: boolean;
}

const GoogleAdsNotification = ({ googleAdsConnected }: GoogleAdsNotificationProps) => {
  if (googleAdsConnected) return null;

  return (
    <Card className="mb-6 border-orange-200 bg-orange-50">
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <div className="text-orange-600">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-medium text-orange-800">Connect Google Ads for Better SEO Insights</h3>
            <p className="text-sm text-orange-600 mt-1">
              Connect your Google Ads account to automatically populate website options and get more comprehensive SEO data.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoogleAdsNotification;
