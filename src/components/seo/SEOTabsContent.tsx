
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import KeywordsTab from './tabs/KeywordsTab';
import PagesTab from './tabs/PagesTab';
import URLMetaDataTab from './tabs/URLMetaDataTab';
import ImageAnalysisTab from './ImageAnalysisTab';
import SitePerformanceTab from './tabs/SitePerformanceTab';
import { Search, FileText, Link, Image, Activity } from 'lucide-react';

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
    <div className="mt-8">
      <Tabs defaultValue="keywords" onValueChange={onTabChange} value={activeTab}>
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg mb-6 p-1 shadow-sm">
          <TabsList className="w-full justify-start bg-transparent p-0 h-auto">
            <TabsTrigger 
              value="keywords" 
              className="flex items-center gap-2 px-4 py-3 rounded-md data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              <Search className="w-4 h-4" />
              Keywords ({serpKeywords.length})
            </TabsTrigger>
            <TabsTrigger 
              value="pages"
              className="flex items-center gap-2 px-4 py-3 rounded-md data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              <FileText className="w-4 h-4" />
              Pages ({pages.length})
            </TabsTrigger>
            <TabsTrigger 
              value="urlData"
              className="flex items-center gap-2 px-4 py-3 rounded-md data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              <Link className="w-4 h-4" />
              URL Meta Data ({urlMetaData.length})
            </TabsTrigger>
            <TabsTrigger 
              value="imageAnalysis"
              className="flex items-center gap-2 px-4 py-3 rounded-md data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              <Image className="w-4 h-4" />
              Image Analysis
            </TabsTrigger>
            <TabsTrigger 
              value="sitePerformance"
              className="flex items-center gap-2 px-4 py-3 rounded-md data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              <Activity className="w-4 h-4" />
              Site Performance
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <TabsContent value="keywords" className="p-6 space-y-4 m-0">
            <KeywordsTab 
              serpKeywords={serpKeywords}
              selectedWebsite={selectedWebsite}
            />
          </TabsContent>

          <TabsContent value="pages" className="p-6 m-0">
            <PagesTab 
              pages={pages}
              selectedWebsite={selectedWebsite}
            />
          </TabsContent>
          
          <TabsContent value="urlData" className="p-6 m-0">
            <URLMetaDataTab 
              urlMetaData={urlMetaData}
              selectedWebsite={selectedWebsite}
            />
          </TabsContent>

          <TabsContent value="imageAnalysis" className="p-6 m-0">
            <ImageAnalysisTab 
              urlMetaData={urlMetaData}
              selectedWebsite={selectedWebsite}
            />
          </TabsContent>
          
          <TabsContent value="sitePerformance" className="p-6 m-0">
            <SitePerformanceTab 
              urlMetaData={urlMetaData}
              sitePerformance={sitePerformance}
              selectedWebsite={selectedWebsite}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default SEOTabsContent;
