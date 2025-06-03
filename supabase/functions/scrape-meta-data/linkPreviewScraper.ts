
import { MetaDataResult } from './types.ts';
import { REQUEST_TIMEOUT } from './constants.ts';

export const scrapeWithLinkPreview = async (url: string, apiKey: string): Promise<MetaDataResult> => {
  console.log(`Using LinkPreview API for: ${url}`);
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  
  try {
    const linkPreviewResponse = await fetch(
      `https://api.linkpreview.net/?key=${apiKey}&q=${encodeURIComponent(url)}`,
      { 
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; LinkPreview/1.0)'
        }
      }
    );
    
    clearTimeout(timeoutId);
    
    if (!linkPreviewResponse.ok) {
      throw new Error(`LinkPreview API error: ${linkPreviewResponse.status}`);
    }

    const linkPreviewData = await linkPreviewResponse.json();
    
    return {
      url: url,
      metaTitle: linkPreviewData.title || 'No title found',
      metaDescription: linkPreviewData.description || 'No description found',
      image: linkPreviewData.image || null,
      siteName: linkPreviewData.siteName || null,
      domain: linkPreviewData.domain || null
    };
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};
