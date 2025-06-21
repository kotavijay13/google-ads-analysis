import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import { Package, ShoppingCart, TrendingUp, DollarSign, Copy, Check } from 'lucide-react';

const ProductSalesPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [shopifyStoreUrl, setShopifyStoreUrl] = useState('');
  const [isConnectingEcom, setIsConnectingEcom] = useState(false);
  const [customWebsiteUrl, setCustomWebsiteUrl] = useState('');
  const [isConnectingCustom, setIsConnectingCustom] = useState(false);
  const [connectedWebsites, setConnectedWebsites] = useState<string[]>([]);
  const [copiedScript, setCopiedScript] = useState(false);

  const handleEcomConnect = async () => {
    if (!shopifyStoreUrl.trim()) {
      toast.error('Please enter your Shopify store URL');
      return;
    }
    
    setIsConnectingEcom(true);
    try {
      // Simulate connection process
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(`Successfully connected to Shopify store: ${shopifyStoreUrl}`);
      setShopifyStoreUrl('');
    } catch (error) {
      toast.error('Failed to connect to Shopify store');
    } finally {
      setIsConnectingEcom(false);
    }
  };

  const handleCustomWebsiteConnect = async () => {
    if (!customWebsiteUrl.trim()) {
      toast.error('Please enter your website URL');
      return;
    }
    
    setIsConnectingCustom(true);
    try {
      // Simulate connection process
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(`Successfully connected to custom website: ${customWebsiteUrl}`);
      setConnectedWebsites(prev => [...prev, customWebsiteUrl]);
      setCustomWebsiteUrl('');
      // Switch to integrations tab to show the tracking script
      setActiveTab('integrations');
    } catch (error) {
      toast.error('Failed to connect to custom website');
    } finally {
      setIsConnectingCustom(false);
    }
  };

  const trackingScript = `<!-- Merge Insights AI Sales Tracking Script -->
<script>
  (function() {
    // Initialize tracking
    window.MergeInsightsAI = window.MergeInsightsAI || {};
    window.MergeInsightsAI.websiteUrl = '${connectedWebsites[0] || 'your-website.com'}';
    
    // Track page views
    function trackPageView() {
      console.log('Page view tracked:', window.location.href);
      // Send data to your analytics endpoint
    }
    
    // Track product views
    function trackProductView(productId, productName, price) {
      console.log('Product view:', { productId, productName, price });
      // Send product view data
    }
    
    // Track purchases
    function trackPurchase(orderId, total, items) {
      console.log('Purchase tracked:', { orderId, total, items });
      // Send purchase data
    }
    
    // Auto-track page views
    trackPageView();
    
    // Expose functions globally
    window.MergeInsightsAI.trackProductView = trackProductView;
    window.MergeInsightsAI.trackPurchase = trackPurchase;
  })();
</script>`;

  const copyTrackingScript = async () => {
    try {
      await navigator.clipboard.writeText(trackingScript);
      setCopiedScript(true);
      toast.success('Tracking script copied to clipboard!');
      setTimeout(() => setCopiedScript(false), 2000);
    } catch (error) {
      toast.error('Failed to copy script');
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary">Product Sales Analytics</h1>
        <p className="text-muted-foreground">Track and analyze your product sales performance across all channels</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Overview</TabsTrigger>
          <TabsTrigger value="integrations" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Integrations</TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$0</div>
                <p className="text-xs text-muted-foreground">Connect your store to see data</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Total orders this month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Products Sold</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Items sold this month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Growth</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0%</div>
                <p className="text-xs text-muted-foreground">vs last month</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No sales data available</p>
                <p className="text-sm">Connect your e-commerce platform or custom website to start tracking sales</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>E-commerce Platforms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ecom-platform">Platform</Label>
                <Select defaultValue="shopify">
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shopify">Shopify</SelectItem>
                    <SelectItem value="woocommerce" disabled>WooCommerce (coming soon)</SelectItem>
                    <SelectItem value="bigcommerce" disabled>BigCommerce (coming soon)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shopify-url">Shopify Store URL</Label>
                <Input
                  id="shopify-url"
                  placeholder="e.g., your-store.myshopify.com"
                  value={shopifyStoreUrl}
                  onChange={(e) => setShopifyStoreUrl(e.target.value)}
                />
              </div>

              <Button 
                onClick={handleEcomConnect}
                disabled={isConnectingEcom}
                className="w-full"
              >
                {isConnectingEcom ? 'Connecting...' : 'Connect to Shopify'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Custom Website Integration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="custom-website">Website URL</Label>
                <Input
                  id="custom-website"
                  placeholder="e.g., https://yourwebsite.com"
                  value={customWebsiteUrl}
                  onChange={(e) => setCustomWebsiteUrl(e.target.value)}
                />
              </div>

              <Button 
                onClick={handleCustomWebsiteConnect}
                disabled={isConnectingCustom}
                className="w-full"
                variant="outline"
              >
                {isConnectingCustom ? 'Connecting...' : 'Connect Custom Website'}
              </Button>

              {connectedWebsites.length > 0 && (
                <div className="mt-6 space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-900 mb-2">✅ Website Connected Successfully!</h4>
                    <p className="text-sm text-green-800">
                      Your website <strong>{connectedWebsites[0]}</strong> has been connected. 
                      Follow the integration steps below to start tracking sales.
                    </p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-3">📋 Integration Steps</h4>
                    <ol className="list-decimal list-inside text-sm text-blue-800 space-y-2">
                      <li><strong>Copy the tracking script below</strong> and paste it in your website's HTML head section</li>
                      <li><strong>Add product tracking</strong> on your product pages using the provided functions</li>
                      <li><strong>Set up purchase tracking</strong> on your checkout completion page</li>
                      <li><strong>Test the integration</strong> by making a test purchase</li>
                    </ol>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">Tracking Script</h4>
                      <Button
                        onClick={copyTrackingScript}
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        {copiedScript ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copiedScript ? 'Copied!' : 'Copy Script'}
                      </Button>
                    </div>
                    <pre className="text-xs bg-white p-3 rounded border overflow-x-auto">
                      <code>{trackingScript}</code>
                    </pre>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold text-yellow-900 mb-2">🔧 Additional Implementation</h4>
                    <div className="text-sm text-yellow-800 space-y-2">
                      <p><strong>For Product Pages:</strong></p>
                      <code className="block bg-white p-2 rounded text-xs">
                        MergeInsightsAI.trackProductView('product-123', 'Product Name', 29.99);
                      </code>
                      
                      <p className="mt-3"><strong>For Purchase Completion:</strong></p>
                      <code className="block bg-white p-2 rounded text-xs">
                        {`MergeInsightsAI.trackPurchase('order-456', 59.98, [{ id: 'product-123', name: 'Product Name', price: 29.99, quantity: 2 }]);`}
                      </code>
                    </div>
                  </div>
                </div>
              )}

              {connectedWebsites.length === 0 && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Integration Guide for Custom Websites</h4>
                  <p className="text-sm text-blue-800 mb-3">
                    To track sales from your custom website built with VS Code, you'll need to:
                  </p>
                  <ol className="list-decimal list-inside text-sm text-blue-800 space-y-1">
                    <li>Add our tracking script to your website</li>
                    <li>Configure product tracking events</li>
                    <li>Set up conversion tracking for purchases</li>
                    <li>Map your product data to our analytics system</li>
                  </ol>
                  <p className="text-xs text-blue-600 mt-3">
                    After connecting, we'll provide you with detailed integration instructions and code snippets.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Connected Sales Channels</CardTitle>
            </CardHeader>
            <CardContent>
              {connectedWebsites.length > 0 ? (
                <div className="space-y-3">
                  {connectedWebsites.map((website, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="font-medium text-green-900">{website}</p>
                          <p className="text-xs text-green-700">Custom Website • Connected</p>
                        </div>
                      </div>
                      <div className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                        Active
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No sales channels connected yet.</p>
                  <p className="text-sm">Connect your first sales channel to start tracking performance.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No analytics data available</p>
                <p className="text-sm">Connect your sales channels to see detailed product insights</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>Connect your store to see top-selling products</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sales Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>AI-powered insights will appear here once you have sales data</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductSalesPage;
