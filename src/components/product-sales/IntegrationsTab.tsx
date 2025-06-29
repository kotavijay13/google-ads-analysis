
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Globe, Package, Check, Copy, ExternalLink, Zap } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import IntegrationCard from './IntegrationCard';

interface IntegrationsTabProps {
  shopifyStoreUrl: string;
  setShopifyStoreUrl: (url: string) => void;
  customWebsiteUrl: string;
  setCustomWebsiteUrl: (url: string) => void;
  isConnectingEcom: boolean;
  isConnectingCustom: boolean;
  connectedWebsites: string[];
  onEcomConnect: () => void;
  onCustomWebsiteConnect: () => void;
  trackingScript: string;
  copiedScript: boolean;
  onCopyTrackingScript: () => void;
}

const IntegrationsTab = ({
  shopifyStoreUrl,
  setShopifyStoreUrl,
  customWebsiteUrl,
  setCustomWebsiteUrl,
  isConnectingEcom,
  isConnectingCustom,
  connectedWebsites,
  onEcomConnect,
  onCustomWebsiteConnect,
  trackingScript,
  copiedScript,
  onCopyTrackingScript
}: IntegrationsTabProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IntegrationCard
          icon={<ShoppingCart className="h-5 w-5 text-green-600" />}
          title="Shopify Store"
          description="Connect your Shopify store"
          urlLabel="Store URL"
          urlPlaceholder="your-store.myshopify.com"
          url={shopifyStoreUrl}
          onUrlChange={setShopifyStoreUrl}
          onConnect={onEcomConnect}
          isConnecting={isConnectingEcom}
          buttonText="Connect Shopify"
          buttonIcon={<Zap className="w-4 h-4 mr-2" />}
          features={[
            'Automatic order tracking',
            'Real-time sales data',
            'Product performance insights'
          ]}
          variant="primary"
        />

        <IntegrationCard
          icon={<Globe className="h-5 w-5 text-green-600" />}
          title="Custom Website"
          description="Connect any website or web app"
          urlLabel="Website URL"
          urlPlaceholder="https://yourwebsite.com"
          url={customWebsiteUrl}
          onUrlChange={setCustomWebsiteUrl}
          onConnect={onCustomWebsiteConnect}
          isConnecting={isConnectingCustom}
          buttonText="Connect Website"
          buttonIcon={<ExternalLink className="w-4 h-4 mr-2" />}
          features={[
            'Manual integration setup',
            'Custom tracking script',
            'Full control over data'
          ]}
          variant="outline"
        />
      </div>

      {/* Integration Success and Instructions */}
      {connectedWebsites.length > 0 && (
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-900 mb-2 flex items-center">
              <Check className="w-5 h-5 mr-2" />
              Website Connected Successfully!
            </h4>
            <p className="text-sm text-green-800">
              Your website <strong>{connectedWebsites[0]}</strong> has been connected. 
              Follow the integration steps below to start tracking sales.
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-900 mb-3 flex items-center">
              <Package className="w-5 h-5 mr-2" />
              Integration Steps
            </h4>
            <ol className="list-decimal list-inside text-sm text-green-800 space-y-2">
              <li><strong>Copy the tracking script below</strong> and paste it in your website's HTML head section</li>
              <li><strong>Add product tracking</strong> on your product pages using the provided functions</li>
              <li><strong>Set up purchase tracking</strong> on your checkout completion page</li>
              <li><strong>Test the integration</strong> by making a test purchase</li>
            </ol>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Tracking Script</CardTitle>
                <Button
                  onClick={onCopyTrackingScript}
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  {copiedScript ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copiedScript ? 'Copied!' : 'Copy Script'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-gray-800 text-green-400 p-4 rounded-lg overflow-x-auto font-mono">
                <code>{trackingScript}</code>
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                Implementation Examples
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium text-sm mb-2">For Product Pages:</p>
                <code className="block bg-gray-800 text-blue-300 p-3 rounded text-xs font-mono">
                  MergeInsightsAI.trackProductView('product-123', 'Product Name', 29.99);
                </code>
              </div>
              
              <div>
                <p className="font-medium text-sm mb-2">For Purchase Completion:</p>
                <code className="block bg-gray-800 text-blue-300 p-3 rounded text-xs font-mono">
                  {`MergeInsightsAI.trackPurchase('order-456', 59.98, [{ id: 'product-123', name: 'Product Name', price: 29.99, quantity: 2 }]);`}
                </code>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Pre-connection Guide */}
      {connectedWebsites.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="w-5 h-5 mr-2" />
              Integration Guide for Custom Websites
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              To track sales from your custom website built with VS Code, you'll need to:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h5 className="font-medium text-green-900 mb-2">1. Add Tracking Script</h5>
                <p className="text-xs text-green-700">Include our JavaScript tracking code in your website's HTML head section</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h5 className="font-medium text-green-900 mb-2">2. Configure Events</h5>
                <p className="text-xs text-green-700">Set up product view and purchase tracking events in your code</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h5 className="font-medium text-green-900 mb-2">3. Map Product Data</h5>
                <p className="text-xs text-green-700">Connect your product information to our analytics system</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h5 className="font-medium text-green-900 mb-2">4. Test Integration</h5>
                <p className="text-xs text-green-700">Verify tracking works correctly with test purchases</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Connected Sales Channels */}
      <Card>
        <CardHeader>
          <CardTitle>Connected Sales Channels</CardTitle>
        </CardHeader>
        <CardContent>
          {connectedWebsites.length > 0 ? (
            <div className="space-y-3">
              {connectedWebsites.map((website, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <div>
                      <p className="font-medium text-green-900">{website}</p>
                      <p className="text-xs text-green-700">Custom Website • Connected</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-green-600 bg-green-100 px-3 py-1 rounded-full">
                      Active
                    </div>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="font-medium">No sales channels connected yet</p>
              <p className="text-sm">Connect your first sales channel to start tracking performance</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationsTab;
