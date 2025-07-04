
import { LucideIcon } from 'lucide-react';

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  channel: 'seo' | 'google-ads' | 'meta-ads' | 'leads' | 'cross-channel';
  impact: string;
  action: string;
  recommendations?: {
    metaTitle?: string;
    metaDescription?: string;
    headerTags?: string[];
    keywordDensity?: string;
    internalLinks?: string[];
    externalLinks?: string[];
    technicalSeo?: string[];
  };
}

export interface Top5AIInsightsProps {
  onInsightCompleted?: (insightId: string) => void;
}
