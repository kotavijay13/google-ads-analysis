
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import KeywordsTab from './tabs/KeywordsTab';
import PagesTab from './tabs/PagesTab';
import URLMetaDataTab from './tabs/URLMetaDataTab';
import ImageAnalysisTab from './ImageAnalysisTab';
import SitePerformanceTab from './tabs/SitePerformanceTab';

interface SEOTabsContentProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  serpKeywords: any[];
  pages: any[];
  urlMetaData: any[];
  sitePerformance: any;
  selectedWebsite: string;
}

const SEOTabsContent = ({ 
  activeTab, 
  onTabChange, 
  serpKeywords, 
  pages, 
  urlMetaData, 
  sitePerformance, 
  selectedWebsite 
}: SEOTabsContentProps) => {
  
  return (
    <Tabs defaultValue="keywords" className="mt-6" onValueChange={onTabChange} value={activeTab}>
      <TabsList className="mb-6">
        <TabsTrigger value="keywords">Keywords ({serpKeywords.length})</TabsTrigger>
        <TabsTrigger value="pages">Pages ({pages.length})</TabsTrigger>
        <TabsTrigger value="urlData">URL Meta Data ({urlMetaData.length})</TabsTrigger>
        <TabsTrigger value="imageAnalysis">Image Analysis</TabsTrigger>
        <TabsTrigger value="sitePerformance">Site Performance</TabsTrigger>
      </TabsList>

      <TabsContent value="keywords" className="space-y-4">
        <KeywordsTab 
          serpKeywords={serpKeywords}
          selectedWebsite={selectedWebsite}
        />
      </TabsContent>

      <TabsContent value="pages">
        <PagesTab 
          pages={pages}
          selectedWebsite={selectedWebsite}
        />
      </TabsContent>
      
      <TabsContent value="urlData">
        <URLMetaDataTab 
          urlMetaData={urlMetaData}
          selectedWebsite={selectedWebsite}
        />
      </TabsContent>

      <TabsContent value="imageAnalysis">
        <ImageAnalysisTab 
          urlMetaData={urlMetaData}
          selectedWebsite={selectedWebsite}
        />
      </TabsContent>
      
      <TabsContent value="sitePerformance">
        <SitePerformanceTab 
          urlMetaData={urlMetaData}
          sitePerformance={sitePerformance}
          selectedWebsite={selectedWebsite}
        />
      </TabsContent>
    </Tabs>
  );
};

export default SEOTabsContent;
