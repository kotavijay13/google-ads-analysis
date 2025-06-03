
import { MetaDataResult } from './types.ts';
import { scrapeWithLinkPreview } from './linkPreviewScraper.ts';
import { scrapeWithNativeFetch } from './nativeScraper.ts';
import { BATCH_SIZE, MAX_URLS, BATCH_DELAY, REQUEST_DELAY } from './constants.ts';

export const processUrls = async (urls: string[], apiKey?: string): Promise<MetaDataResult[]> => {
  const metaDataResults: MetaDataResult[] = [];
  const totalUrls = Math.min(urls.length, MAX_URLS);
  
  for (let i = 0; i < totalUrls; i += BATCH_SIZE) {
    const batch = urls.slice(i, i + BATCH_SIZE);
    console.log(`Processing batch ${i / BATCH_SIZE + 1} of ${Math.ceil(totalUrls / BATCH_SIZE)} (${batch.length} URLs)`);
    
    for (const url of batch) {
      try {
        let result: MetaDataResult;
        
        // Try LinkPreview API first if available
        if (apiKey) {
          try {
            result = await scrapeWithLinkPreview(url, apiKey);
          } catch (linkPreviewError) {
            console.log(`LinkPreview failed for ${url}, trying native scraping:`, linkPreviewError);
            result = await scrapeWithNativeFetch(url);
          }
        } else {
          console.log('No LinkPreview API key, using native scraping');
          result = await scrapeWithNativeFetch(url);
        }
        
        metaDataResults.push(result);
        
        // Add delay between requests
        await new Promise(resolve => setTimeout(resolve, REQUEST_DELAY));
        
      } catch (error) {
        console.error(`Error processing ${url}:`, error);
        metaDataResults.push({
          url: url,
          metaTitle: 'Error fetching',
          metaDescription: 'Error fetching',
          error: error.message
        });
      }
    }
    
    // Add longer delay between batches
    if (i + BATCH_SIZE < totalUrls) {
      console.log('Waiting between batches...');
      await new Promise(resolve => setTimeout(resolve, BATCH_DELAY));
    }
  }

  return metaDataResults;
};
