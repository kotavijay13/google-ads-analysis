
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/sonner';
import { Zap, ExternalLink } from 'lucide-react';
import ProductSalesHeader from '@/components/product-sales/ProductSalesHeader';
import OverviewTab from '@/components/product-sales/OverviewTab';
import IntegrationsTab from '@/components/product-sales/IntegrationsTab';
import AnalyticsTab from '@/components/product-sales/AnalyticsTab';

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
      <ProductSalesHeader 
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Overview</TabsTrigger>
          <TabsTrigger value="integrations" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Integrations</TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <OverviewTab />
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <IntegrationsTab
            shopifyStoreUrl={shopifyStoreUrl}
            setShopifyStoreUrl={setShopifyStoreUrl}
            customWebsiteUrl={customWebsiteUrl}
            setCustomWebsiteUrl={setCustomWebsiteUrl}
            isConnectingEcom={isConnectingEcom}
            isConnectingCustom={isConnectingCustom}
            connectedWebsites={connectedWebsites}
            onEcomConnect={handleEcomConnect}
            onCustomWebsiteConnect={handleCustomWebsiteConnect}
            trackingScript={trackingScript}
            copiedScript={copiedScript}
            onCopyTrackingScript={copyTrackingScript}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <AnalyticsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductSalesPage;
