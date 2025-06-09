
import { useState } from 'react';
import Header from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Competitor } from './competition/types';
import { generateEnhancedAnalysis } from './competition/dataGeneration';
import CompetitorInput from './competition/CompetitorInput';
import TrafficOverviewCards from './competition/TrafficOverviewCards';
import TrafficDistribution from './competition/TrafficDistribution';
import SEOMetrics from './competition/SEOMetrics';
import GeographicMarkets from './competition/GeographicMarkets';
import KeywordRankingsTable from './competition/KeywordRankingsTable';

const CompetitionAnalysis = () => {
  const [activeTab, setActiveTab] = useState('competitor1');
  const [competitors, setCompetitors] = useState<Competitor[]>([
    { id: 'competitor1', url: '', data: null, loading: false },
    { id: 'competitor2', url: '', data: null, loading: false },
    { id: 'competitor3', url: '', data: null, loading: false }
  ]);

  const analyzeCompetitor = async (competitorId: string) => {
    const competitor = competitors.find(c => c.id === competitorId);
    if (!competitor?.url) {
      toast.error("Please enter a competitor website URL");
      return;
    }
    
    setCompetitors(prev => prev.map(c => 
      c.id === competitorId ? { ...c, loading: true } : c
    ));
    
    toast.info(`Analyzing competitor website: ${competitor.url}`);
    
    try {
      const { data, error: supabaseError } = await supabase.functions.invoke('serp-api', {
        body: { websiteUrl: competitor.url, enhanced: true }
      });
      
      if (supabaseError) {
        console.error('Supabase function error:', supabaseError);
        toast.error(`Error: ${supabaseError.message || 'Failed to analyze competitor'}`);
        return;
      }
      
      if (data.error) {
        console.error('SERP API error:', data.error);
        toast.error(data.error);
        return;
      }
      
      const enhancedData = generateEnhancedAnalysis(data, competitor.url);
      
      setCompetitors(prev => prev.map(c => 
        c.id === competitorId ? {
          ...c,
          data: enhancedData,
          loading: false
        } : c
      ));
      
      toast.success(`Analysis complete! Found ${enhancedData.keywords.length} keywords with detailed insights`);
      
    } catch (error: any) {
      console.error('Exception during analysis:', error);
      toast.error("Failed to analyze competitor. Please try again later.");
      setCompetitors(prev => prev.map(c => 
        c.id === competitorId ? { ...c, loading: false } : c
      ));
    }
  };

  const updateCompetitorUrl = (competitorId: string, url: string) => {
    setCompetitors(prev => prev.map(c => 
      c.id === competitorId ? { ...c, url } : c
    ));
  };

  const clearCompetitor = (competitorId: string) => {
    setCompetitors(prev => prev.map(c => 
      c.id === competitorId ? { ...c, url: '', data: null } : c
    ));
  };

  const getCompetitorLabel = (competitorId: string) => {
    switch (competitorId) {
      case 'competitor1': return 'First';
      case 'competitor2': return 'Second';
      case 'competitor3': return 'Third';
      default: return '';
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <Header onRefresh={() => {}} title="Competition Analysis" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-lg font-medium">Advanced Competitor Website Analysis</h2>
      </div>

      <Tabs defaultValue="competitor1" className="space-y-6" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          {competitors.map((competitor, index) => (
            <TabsTrigger key={competitor.id} value={competitor.id} className="relative">
              Competitor {index + 1}
              {competitor.url && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute -top-1 -right-1 h-4 w-4 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearCompetitor(competitor.id);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {competitors.map((competitor) => (
          <TabsContent key={competitor.id} value={competitor.id} className="space-y-6">
            <CompetitorInput
              competitor={competitor}
              onUrlChange={(url) => updateCompetitorUrl(competitor.id, url)}
              onAnalyze={() => analyzeCompetitor(competitor.id)}
              competitorLabel={getCompetitorLabel(competitor.id)}
            />

            {competitor.data && (
              <>
                <TrafficOverviewCards data={competitor.data} />
                <TrafficDistribution data={competitor.data} />
                <SEOMetrics data={competitor.data} />
                <GeographicMarkets data={competitor.data} />
                <KeywordRankingsTable data={competitor.data} competitorUrl={competitor.url} />
              </>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default CompetitionAnalysis;
