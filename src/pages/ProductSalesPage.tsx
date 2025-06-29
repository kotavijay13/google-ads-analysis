import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import { Package, ShoppingCart, TrendingUp, DollarSign, Copy, Check, ExternalLink, Zap, Globe } from 'lucide-react';
import DateRangePicker from '@/components/DateRangePicker';

const ProductSalesPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [shopifyStoreUrl, setShopifyStoreUrl] = useState('');
  const [isConnectingEcom, setIsConnectingEcom] = useState(false);
  const [customWebsiteUrl, setCustomWebsiteUrl] = useState('');
  const [isConnectingCustom, setIsConnectingCustom] = useState(false);
  const [connectedWebsites, setConnectedWebsites] = useState<string[]>([]);
  const [copiedScript, setCopiedScript] = useState(false);
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Default to last 30 days
    to: new Date()
  });

  const handleDateRangeChange = (newDateRange: { from: Date; to: Date }) => {
    setDateRange(newDateRange);
    console.log('Product Sales date range changed:', newDateRange);
    // Here you would typically refresh your sales data based on the new date range
  };

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
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-primary">Product Sales Analytics</h1>
          <p className="text-muted-foreground">Track and analyze your product sales performance across all channels</p>
        </div>
        <div className="flex flex-col items-end">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sales Date Range
          </label>
          <DateRangePicker onDateChange={handleDateRangeChange} />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Overview</TabsTrigger>
          <TabsTrigger value="integrations" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Integrations</TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Analytics</TabsTrigger>
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

        <TabsContent value="integrations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Shopify Integration Card */}
            <Card className="border-2 hover:border-green-200 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Shopify Store</CardTitle>
                    <p className="text-sm text-muted-foreground">Connect your Shopify store</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="shopify-url" className="text-sm font-medium">Store URL</Label>
                  <Input
                    id="shopify-url"
                    placeholder="your-store.myshopify.com"
                    value={shopifyStoreUrl}
                    onChange={(e) => setShopifyStoreUrl(e.target.value)}
                    className="h-10"
                  />
                </div>
                <Button 
                  onClick={handleEcomConnect}
                  disabled={isConnectingEcom}
                  className="w-full h-10 bg-green-600 hover:bg-green-700"
                >
                  {isConnectingEcom ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Connect Shopify
                    </>
                  )}
                </Button>
                <div className="text-xs text-muted-foreground bg-gray-50 p-2 rounded">
                  <p>• Automatic order tracking</p>
                  <p>• Real-time sales data</p>
                  <p>• Product performance insights</p>
                </div>
              </CardContent>
            </Card>

            {/* Custom Website Integration Card */}
            <Card className="border-2 hover:border-green-200 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Globe className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Custom Website</CardTitle>
                    <p className="text-sm text-muted-foreground">Connect any website or web app</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="custom-website" className="text-sm font-medium">Website URL</Label>
                  <Input
                    id="custom-website"
                    placeholder="https://yourwebsite.com"
                    value={customWebsiteUrl}
                    onChange={(e) => setCustomWebsiteUrl(e.target.value)}
                    className="h-10"
                  />
                </div>
                <Button 
                  onClick={handleCustomWebsiteConnect}
                  disabled={isConnectingCustom}
                  variant="outline"
                  className="w-full h-10 border-green-200 hover:bg-green-50"
                >
                  {isConnectingCustom ? (
                    <>
                      <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin mr-2" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Connect Website
                    </>
                  )}
                </Button>
                <div className="text-xs text-muted-foreground bg-gray-50 p-2 rounded">
                  <p>• Manual integration setup</p>
                  <p>• Custom tracking script</p>
                  <p>• Full control over data</p>
                </div>
              </CardContent>
            </Card>
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
                      onClick={copyTrackingScript}
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
