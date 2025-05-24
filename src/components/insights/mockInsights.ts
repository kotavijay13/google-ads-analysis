
import { TrendingUp, AlertTriangle, Target, Users, Search } from 'lucide-react';
import { AIInsight } from './types';

export const initialInsights: AIInsight[] = [
  {
    id: '1',
    title: "Increase bid for 'digital marketing' keyword",
    description: "Currently underperforming with high potential ROI",
    impact: 'High Impact',
    source: 'Google Ads',
    icon: TrendingUp,
    actionable: true
  },
  {
    id: '2',
    title: "Optimize meta descriptions for top 5 landing pages",
    description: "Current CTR is below average",
    impact: 'Medium Impact',
    source: 'SEO',
    icon: Search,
    actionable: true
  },
  {
    id: '3',
    title: "Refresh creative for Instagram Story campaign",
    description: "Engagement dropping over the past week",
    impact: 'High Impact',
    source: 'Meta Ads',
    icon: AlertTriangle,
    actionable: true
  },
  {
    id: '4',
    title: "Target competitor keyword 'marketing automation'",
    description: "Competitor ranking dropped, opportunity to gain position",
    impact: 'Medium Impact',
    source: 'Competition',
    icon: Target,
    actionable: true
  },
  {
    id: '5',
    title: "Follow up with 12 high-value leads",
    description: "Leads from last week's campaign waiting for response",
    impact: 'High Impact',
    source: 'Leads',
    icon: Users,
    actionable: true
  }
];
