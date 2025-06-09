
import { EnhancedAnalysisResponse, CompetitorOverview } from './types';

export const generateEnhancedAnalysis = (basicData: any, url: string): EnhancedAnalysisResponse => {
  const keywords = (basicData.keywords || []).slice(0, 1000).map((keyword: any, index: number) => ({
    ...keyword,
    ctr: Math.random() * 15 + 1, // 1-16% CTR
    cpc: Math.random() * 5 + 0.5, // $0.5-$5.5 CPC
    trend: index % 3 === 0 ? 'up' : index % 3 === 1 ? 'down' : 'stable'
  }));

  const domain = url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0];
  const domainSeed = domain.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const overview: CompetitorOverview = {
    domainAuthority: Math.min(85, Math.max(15, 30 + (domainSeed % 40))),
    backlinks: 1000 + (domainSeed % 50000),
    referringDomains: 100 + (domainSeed % 2000),
    organicKeywords: keywords.length,
    paidKeywords: Math.floor(keywords.length * 0.3),
    trafficValue: Math.floor((keywords.reduce((sum, k) => sum + k.estimatedVisits, 0) * 2.5)),
    monthlyVisits: keywords.reduce((sum, k) => sum + k.estimatedVisits, 0),
    bounceRate: Math.min(80, Math.max(25, 45 + (domainSeed % 20))),
    avgSessionDuration: `${Math.floor(Math.random() * 3) + 2}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
    pagesPerSession: Math.round((Math.random() * 3 + 1.5) * 10) / 10,
    trafficDistribution: {
      organic: Math.floor(Math.random() * 40) + 40, // 40-80%
      paid: Math.floor(Math.random() * 20) + 5,     // 5-25%
      direct: Math.floor(Math.random() * 15) + 10,  // 10-25%
      referral: Math.floor(Math.random() * 10) + 5, // 5-15%
      social: Math.floor(Math.random() * 8) + 2,    // 2-10%
      email: Math.floor(Math.random() * 5) + 1      // 1-6%
    },
    topCountries: [
      { country: 'United States', percentage: 45 + Math.floor(Math.random() * 20) },
      { country: 'United Kingdom', percentage: 8 + Math.floor(Math.random() * 10) },
      { country: 'Canada', percentage: 5 + Math.floor(Math.random() * 8) },
      { country: 'Australia', percentage: 3 + Math.floor(Math.random() * 5) },
      { country: 'Germany', percentage: 2 + Math.floor(Math.random() * 4) }
    ],
    topPages: keywords.slice(0, 5).map(k => ({
      url: k.landingUrl || k.competitorUrl,
      traffic: k.estimatedVisits,
      keywords: Math.floor(Math.random() * 50) + 10
    }))
  };

  const visibilityScore = Math.min(100, Math.max(10, 
    (keywords.filter(k => k.position <= 10).length / keywords.length) * 100
  ));

  return {
    keywords,
    overview,
    stats: {
      ...basicData.stats,
      visibilityScore: Math.round(visibilityScore),
      competitionLevel: visibilityScore > 70 ? 'High' : visibilityScore > 40 ? 'Medium' : 'Low'
    }
  };
};
