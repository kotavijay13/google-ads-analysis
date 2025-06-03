
export interface ScrapedImage {
  src: string;
  alt: string;
  hasAltText: boolean;
}

export interface ScrapedMetaData {
  url: string;
  metaTitle: string;
  metaDescription: string;
  image?: string | null;
  siteName?: string | null;
  domain: string;
  images: ScrapedImage[];
  imageCount: number;
  imagesWithoutAlt: number;
  error?: string;
}

export interface ScrapeRequest {
  urls: string[];
}

export interface ScrapeResponse {
  success: boolean;
  metaData: ScrapedMetaData[];
  error?: string;
}
