
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
};

export function extractMetaFromHtml(html: string, url: string) {
  // Extract meta data using regex
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  const descMatch = html.match(/<meta[^>]*name=["\']description["\'][^>]*content=["\']([^"\']*)["\'][^>]*>/i) ||
                   html.match(/<meta[^>]*content=["\']([^"\']*)["\'][^>]*name=["\']description["\'][^>]*>/i);

  return {
    title: titleMatch ? titleMatch[1].trim() : 'No title found',
    description: descMatch ? descMatch[1].trim() : 'No description found'
  };
}

export function extractImagesFromHtml(html: string, url: string) {
  const imageRegex = /<img[^>]*>/gi;
  const images = [];
  let imageMatch;

  while ((imageMatch = imageRegex.exec(html)) !== null) {
    const imgTag = imageMatch[0];
    
    // Extract src
    const srcMatch = imgTag.match(/src=["\']([^"\']*)["\'][^>]*/i);
    const src = srcMatch ? srcMatch[1] : null;
    
    // Extract alt text
    const altMatch = imgTag.match(/alt=["\']([^"\']*)["\'][^>]*/i);
    const alt = altMatch ? altMatch[1] : '';
    
    if (src) {
      // Convert relative URLs to absolute
      let absoluteSrc = src;
      if (src.startsWith('/')) {
        const urlObj = new URL(url);
        absoluteSrc = `${urlObj.protocol}//${urlObj.host}${src}`;
      } else if (!src.startsWith('http')) {
        const urlObj = new URL(url);
        absoluteSrc = `${urlObj.protocol}//${urlObj.host}/${src}`;
      }
      
      images.push({
        src: absoluteSrc,
        alt: alt || 'No alt text',
        hasAltText: alt.length > 0
      });
    }
  }

  return images;
}

export function makeAbsoluteUrl(src: string, baseUrl: string): string {
  if (src.startsWith('http')) {
    return src;
  }
  
  const urlObj = new URL(baseUrl);
  
  if (src.startsWith('/')) {
    return `${urlObj.protocol}//${urlObj.host}${src}`;
  } else {
    return `${urlObj.protocol}//${urlObj.host}/${src}`;
  }
}
