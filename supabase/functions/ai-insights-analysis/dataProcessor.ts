import { GSCData } from './types.ts';

export function prepareAnalysisPrompt(website: string, seoData: GSCData): string {
  // Analyze the rich GSC data to provide specific insights
  const keywordsData = seoData?.keywords || [];
  const pagesData = seoData?.pages || [];
  const urlMetaData = seoData?.urlMetaData || [];
  
  console.log(`Analyzing rich GSC data: ${keywordsData.length} keywords, ${pagesData.length} pages, ${urlMetaData.length} meta entries`);

  return `
    As an expert SEO analyst, analyze the following REAL Google Search Console data for website: ${website}

    KEYWORD ANALYSIS (${keywordsData.length} total keywords):
    ${keywordsData.slice(0, 20).map(k => 
      `- "${k.keyword}": Position ${k.position}, ${k.clicks} clicks, ${k.impressions} impressions, CTR ${k.ctr}%`
    ).join('\n')}

    PAGE PERFORMANCE (${pagesData.length} total pages):
    ${pagesData.slice(0, 15).map(p => 
      `- ${p.url}: ${p.clicks} clicks, ${p.impressions} impressions, Position ${p.position}, CTR ${p.ctr}%`
    ).join('\n')}

    META DATA ANALYSIS (${urlMetaData.length} pages analyzed):
    ${urlMetaData.slice(0, 10).map(u => 
      `- ${u.url}: Title: "${u.metaTitle || 'Missing'}", Description: "${u.metaDescription || 'Missing'}", Images: ${u.imageCount || 0} (${u.imagesWithoutAlt || 0} without alt)`
    ).join('\n')}

    SUMMARY STATS:
    - Total Keywords: ${seoData?.totalKeywords || 0}
    - Average Position: ${seoData?.avgPosition || 'N/A'}
    - Total Clicks: ${seoData?.totalClicks || 0}
    - Total Impressions: ${seoData?.totalImpressions || 0}
    - Click-through Rate: ${seoData?.avgCTR || 0}%
    - Top 10 Keywords: ${seoData?.top10Keywords || 0}
    - Top 3 Keywords: ${seoData?.top3Keywords || 0}

    Analyze this data and provide exactly 4-5 specific, actionable insights covering these categories:
    1. KEYWORD OPPORTUNITIES: Find underperforming keywords with high potential
    2. PAGE OPTIMIZATION: Identify top pages that need improvement or scaling
    3. META DATA ISSUES: Find missing or poorly optimized titles/descriptions
    4. TECHNICAL SEO: Identify image, crawling, or indexing issues
    5. CONTENT STRATEGY: Suggest content improvements based on performance

    Return insights in this JSON format:
    {
      "insights": [
        {
          "id": "unique_id",
          "title": "Insight Title",
          "description": "Detailed analysis and specific recommendations",
          "priority": "high|medium|low",
          "channel": "seo|google-ads|meta-ads|leads|cross-channel",
          "impact": "Description of expected impact",
          "action": "Specific action to take",
          "recommendations": {
            "metaTitle": "Exact meta title recommendation (if applicable)",
            "metaDescription": "Exact meta description recommendation (if applicable)",
            "headerTags": ["H1: Exact H1 recommendation", "H2: Exact H2 recommendations"],
            "keywordDensity": "Target keyword density percentage and keywords",
            "internalLinks": ["Specific internal linking suggestions"],
            "externalLinks": ["Specific external linking suggestions"],
            "technicalSeo": ["Specific technical SEO improvements"]
          }
        }
      ]
    }

    For SEO insights, provide EXACT recommendations:
    - Specific meta titles (50-60 characters)
    - Specific meta descriptions (150-160 characters)
    - Exact H1/H2/H3 tag suggestions
    - Target keyword density percentages
    - Specific internal linking opportunities
    - Relevant external link suggestions
    - Technical SEO improvements

    Focus on actionable, specific recommendations rather than generic advice. Use actual data from ${website} to make recommendations.
    `;
}