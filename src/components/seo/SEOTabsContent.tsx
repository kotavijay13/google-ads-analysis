
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
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border border-gray-200 rounded-2xl mb-6 p-2 shadow-sm">
          <TabsList className="w-full justify-start bg-transparent p-0 h-auto gap-1">
            <TabsTrigger 
              value="keywords" 
              className="flex items-center gap-2 px-5 py-3 rounded-xl data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 hover:bg-gray-50"
            >
              <Search className="w-4 h-4" />
              <span className="font-medium">Keywords</span>
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                {serpKeywords.length}
              </span>
            </TabsTrigger>
            <TabsTrigger 
              value="pages"
              className="flex items-center gap-2 px-5 py-3 rounded-xl data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 hover:bg-gray-50"
            >
              <FileText className="w-4 h-4" />
              <span className="font-medium">Pages</span>
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                {pages.length}
              </span>
            </TabsTrigger>
            <TabsTrigger 
              value="urlData"
              className="flex items-center gap-2 px-5 py-3 rounded-xl data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 hover:bg-gray-50"
            >
              <Link className="w-4 h-4" />
              <span className="font-medium">URL Meta Data</span>
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                {urlMetaData.length}
              </span>
            </TabsTrigger>
            <TabsTrigger 
              value="imageAnalysis"
              className="flex items-center gap-2 px-5 py-3 rounded-xl data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 hover:bg-gray-50"
            >
              <Image className="w-4 h-4" />
              <span className="font-medium">Image Analysis</span>
            </TabsTrigger>
            <TabsTrigger 
              value="sitePerformance"
              className="flex items-center gap-2 px-5 py-3 rounded-xl data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 hover:bg-gray-50"
            >
              <Activity className="w-4 h-4" />
              <span className="font-medium">Site Performance</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <TabsContent value="keywords" className="p-8 space-y-6 m-0">
            <KeywordsTab 
              serpKeywords={serpKeywords}
              selectedWebsite={selectedWebsite}
            />
          </TabsContent>

          <TabsContent value="pages" className="p-8 m-0">
            <PagesTab 
              pages={pages}
              selectedWebsite={selectedWebsite}
            />
          </TabsContent>
          
          <TabsContent value="urlData" className="p-8 m-0">
            <URLMetaDataTab 
              urlMetaData={urlMetaData}
              selectedWebsite={selectedWebsite}
            />
          </TabsContent>

          <TabsContent value="imageAnalysis" className="p-8 m-0">
            <ImageAnalysisTab 
              urlMetaData={urlMetaData}
              selectedWebsite={selectedWebsite}
            />
          </TabsContent>
          
          <TabsContent value="sitePerformance" className="p-8 m-0">
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
