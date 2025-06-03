
import { ScrapedMetaData } from './types.ts';
import { extractMetaFromHtml, extractImagesFromHtml } from './utils.ts';

export async function scrapeWithScraperAPI(url: string, apiKey: string): Promise<ScrapedMetaData> {
  try {
    console.log(`ScraperAPI scraping for: ${url}`);
    
    const scraperApiUrl = `http://api.scraperapi.com?api_key=${apiKey}&url=${encodeURIComponent(url)}&render=true`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    
    const response = await fetch(scraperApiUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SEOBot/1.0)',
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`ScraperAPI HTTP ${response.status}`);
    }
    
    const html = await response.text();
    const meta = extractMetaFromHtml(html, url);
    const images = extractImagesFromHtml(html, url);
    
    return {
      url: url,
      metaTitle: meta.title,
      metaDescription: meta.description,
      image: null,
      siteName: null,
      domain: new URL(url).hostname,
      images: images,
      imageCount: images.length,
      imagesWithoutAlt: images.filter(img => !img.hasAltText).length
    };
  } catch (error) {
    console.error(`ScraperAPI failed for ${url}:`, error);
    return {
      url: url,
      metaTitle: 'Error fetching',
      metaDescription: 'Error fetching',
      error: error.message,
      images: [],
      imageCount: 0,
      imagesWithoutAlt: 0,
      domain: new URL(url).hostname
    };
  }
}

export async function scrapeWithNativeFetch(url: string): Promise<ScrapedMetaData> {
  try {
    console.log(`Native scraping fallback for: ${url}`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    
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
    const meta = extractMetaFromHtml(html, url);
    const images = extractImagesFromHtml(html, url);
    
    return {
      url: url,
      metaTitle: meta.title,
      metaDescription: meta.description,
      image: null,
      siteName: null,
      domain: new URL(url).hostname,
      images: images,
      imageCount: images.length,
      imagesWithoutAlt: images.filter(img => !img.hasAltText).length
    };
  } catch (error) {
    console.error(`Native scraping failed for ${url}:`, error);
    return {
      url: url,
      metaTitle: 'Error fetching',
      metaDescription: 'Error fetching',
      error: error.message,
      images: [],
      imageCount: 0,
      imagesWithoutAlt: 0,
      domain: new URL(url).hostname
    };
  }
}
