
import type { KeywordData } from './types.ts';

export function extractEnhancedKeywordFromResult(result: any, domain: string, industryKeywords: string[], seed: number): string {
  // Enhanced keyword extraction with better logic
  let keywordText = '';
  
  if (result.title) {
    const title = result.title;
    const cleanTitle = title.split(/\s[-|]|\s[•]|\s[\|]/)[0].trim();
    const titleWords = cleanTitle.split(/\s+/)
      .filter(word => word.length > 2)
      .filter(word => !['the', 'and', 'for', 'with', 'page', 'home', 'about', 'contact'].includes(word.toLowerCase()));
    
    if (titleWords.length >= 2) {
      const wordCount = Math.min(4, Math.max(2, titleWords.length));
      keywordText = titleWords.slice(0, wordCount).join(' ').toLowerCase();
    }
  }
  
  if (!keywordText && result.snippet) {
    const snippetWords = result.snippet
      .split(/\s+/)
      .filter(word => word.length > 3 && 
        !['about', 'these', 'their', 'there', 'which', 'when', 'this', 'that'].includes(word.toLowerCase()));
    
    if (snippetWords.length >= 2) {
      const wordCount = Math.min(3, Math.max(2, snippetWords.length));
      keywordText = snippetWords.slice(0, wordCount).join(' ').toLowerCase();
    }
  }
  
  if (!keywordText) {
    const keywordIndex = Math.abs(seed) % industryKeywords.length;
    keywordText = industryKeywords[keywordIndex];
  }
  
  keywordText = keywordText.toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
  
  return keywordText.charAt(0).toUpperCase() + keywordText.slice(1);
}

export function generateEnhancedKeywordEntry(keywordText: string, url: string, seed: number, domain: string, enhanced: boolean = false): KeywordData {
  // More realistic position distribution
  const positionWeight = Math.abs(seed) % 100;
  let position;
  
  if (positionWeight < 5) position = Math.floor(Math.random() * 3) + 1; // Top 3: 5%
  else if (positionWeight < 15) position = Math.floor(Math.random() * 7) + 4; // 4-10: 10%
  else if (positionWeight < 35) position = Math.floor(Math.random() * 10) + 11; // 11-20: 20%
  else if (positionWeight < 65) position = Math.floor(Math.random() * 30) + 21; // 21-50: 30%
  else position = Math.floor(Math.random() * 50) + 51; // 51-100: 35%

  // More realistic search volume based on keyword type
  const baseVolume = keywordText.includes(domain.split('.')[0]) ? 
    500 + (Math.abs(seed) % 2000) : // Brand keywords: 500-2500
    1000 + (Math.abs(seed) % 8000); // Generic keywords: 1000-9000
  
  const searchVolume = Math.floor(baseVolume / 10) * 10; // Round to nearest 10
  
  // Realistic difficulty calculation
  const difficultyBase = keywordText.split(' ').length === 1 ? 70 : // Single words harder
                        keywordText.includes('best') || keywordText.includes('top') ? 65 : // Competitive terms
                        50; // Regular difficulty
  
  const difficulty = Math.min(100, Math.max(1, difficultyBase + (Math.abs(seed) % 30) - 15));
  const difficultyLevel = difficulty > 70 ? "High" : difficulty > 40 ? "Medium" : "Low";
  
  // More realistic CTR based on position
  const ctrByPosition = {
    1: 31.7, 2: 24.7, 3: 18.7, 4: 13.7, 5: 9.5,
    6: 6.1, 7: 4.4, 8: 3.1, 9: 2.5, 10: 2.2
  };
  const baseCtr = position <= 10 ? ctrByPosition[position] || 1.0 : Math.max(0.1, 2.0 / position);
  const ctr = baseCtr * (0.8 + Math.random() * 0.4); // Add some variance
  
  const estimatedVisits = Math.floor(searchVolume * (ctr / 100));
  
  // Realistic change calculation
  const changeProb = Math.abs(seed) % 100;
  let change;
  if (changeProb < 20) change = 0; // No change: 20%
  else if (changeProb < 60) change = Math.floor(Math.random() * 5) + 1; // Up 1-5: 40%
  else change = -(Math.floor(Math.random() * 5) + 1); // Down 1-5: 40%
  
  const result: KeywordData = {
    keyword: keywordText,
    landingUrl: url,
    position: position,
    searchVolume: searchVolume,
    competitorUrl: url,
    change: change >= 0 ? `+${change}` : `${change}`,
    estimatedVisits: estimatedVisits,
    difficulty: difficulty,
    difficultyLevel: difficultyLevel
  };
  
  if (enhanced) {
    result.ctr = Math.round(ctr * 10) / 10;
    result.cpc = Math.round((0.5 + Math.random() * 4.5) * 100) / 100; // $0.50-$5.00
    result.trend = change > 2 ? 'up' : change < -2 ? 'down' : 'stable';
  }
  
  return result;
}
