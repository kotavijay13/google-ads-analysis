
import { ScrapedMetaData } from './types.ts';
import { scrapeWithScraperAPI, scrapeWithNativeFetch } from './scrapers.ts';

export async function processBatch(
  urls: string[], 
  scraperApiKey: string | undefined
): Promise<ScrapedMetaData[]> {
  const metaDataResults: ScrapedMetaData[] = [];
  const batchSize = 3;
  const totalUrls = Math.min(urls.length, 500);
  
  for (let i = 0; i < totalUrls; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    console.log(`Processing batch ${i / batchSize + 1} of ${Math.ceil(totalUrls / batchSize)} (${batch.length} URLs)`);
    
    const batchPromises = batch.map(async (url) => {
      try {
        let result: ScrapedMetaData;
        
        // Try ScraperAPI first if available
        if (scraperApiKey) {
          try {
            result = await scrapeWithScraperAPI(url, scraperApiKey);
          } catch (scraperApiError) {
            console.log(`ScraperAPI failed for ${url}, trying native scraping:`, scraperApiError);
            result = await scrapeWithNativeFetch(url);
          }
        } else {
          console.log('No ScraperAPI key, using native scraping');
          result = await scrapeWithNativeFetch(url);
        }
        
        return result;
        
      } catch (error) {
        console.error(`Error processing ${url}:`, error);
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
    });
    
    const batchResults = await Promise.all(batchPromises);
    metaDataResults.push(...batchResults);
    
    // Add delay between batches
    if (i + batchSize < totalUrls) {
      console.log('Waiting between batches...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  return metaDataResults;
}
