
export interface MetaDataResult {
  url: string;
  metaTitle: string;
  metaDescription: string;
  image?: string | null;
  siteName?: string | null;
  domain?: string | null;
  error?: string;
}

export interface RequestBody {
  urls: string[];
}

export interface ResponseData {
  success: boolean;
  metaData: MetaDataResult[];
  error?: string;
}
