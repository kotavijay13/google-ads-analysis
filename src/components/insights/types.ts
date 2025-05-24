
import { LucideIcon } from 'lucide-react';

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  impact: 'High Impact' | 'Medium Impact' | 'Low Impact';
  source: 'Google Ads' | 'Meta Ads' | 'SEO' | 'Leads' | 'Competition';
  icon: LucideIcon;
  actionable: boolean;
}

export interface Top5AIInsightsProps {
  onInsightCompleted?: (insightId: string) => void;
}
