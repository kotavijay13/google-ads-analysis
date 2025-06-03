
import { MetaDataResult } from './types.ts';

export const scrapeWithNativeFetch = async (url: string): Promise<MetaDataResult> => {
  try {
    console.log(`Native scraping for: ${url}`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SEOBot/1.0)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const html = await response.text();
    
    // Extract meta data using regex
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    const descMatch = html.match(/<meta[^>]*name=["\']description["\'][^>]*content=["\']([^"\']*)["\'][^>]*>/i) ||
                     html.match(/<meta[^>]*content=["\']([^"\']*)["\'][^>]*name=["\']description["\'][^>]*>/i);
    
    return {
      url: url,
      metaTitle: titleMatch ? titleMatch[1].trim() : 'No title found',
      metaDescription: descMatch ? descMatch[1].trim() : 'No description found',
      image: null,
      siteName: null,
      domain: new URL(url).hostname
    };
  } catch (error) {
    console.error(`Native scraping failed for ${url}:`, error);
    return {
      url: url,
      metaTitle: 'Error fetching',
      metaDescription: 'Error fetching',
      error: error.message
    };
  }
};
