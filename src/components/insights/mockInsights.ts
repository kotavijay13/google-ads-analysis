
import { AIInsight } from './types';
import { TrendingUp, Users, MessageSquare, Target, AlertCircle } from 'lucide-react';

export const initialInsights: AIInsight[] = [
  {
    id: 'lead-conversion',
    title: 'Improve Lead Conversion Rate',
    description: 'Your lead conversion rate dropped by 15% this week. Consider reviewing your lead qualification process and follow-up timing.',
    impact: 'High Impact',
    source: 'Leads',
    icon: TrendingUp,
    actionable: true
  },
  {
    id: 'chat-response',
    title: 'Reduce Chat Response Time',
    description: 'Average chat response time is 4.2 minutes. Faster responses could improve customer satisfaction by 25%.',
    impact: 'Medium Impact',
    source: 'Competition',
    icon: MessageSquare,
    actionable: true
  },
  {
    id: 'audience-expansion',
    title: 'Expand Target Audience',
    description: 'Similar audience segments show 40% higher engagement rates. Consider testing broader targeting options.',
    impact: 'Medium Impact',
    source: 'Competition',
    icon: Users,
    actionable: true
  },
  {
    id: 'competitor-analysis',
    title: 'Competitor Price Advantage',
    description: 'Main competitors are offering 20% lower prices on similar services. Consider adjusting your value proposition.',
    impact: 'High Impact',
    source: 'Competition',
    icon: Target,
    actionable: true
  },
  {
    id: 'form-optimization',
    title: 'Optimize Contact Forms',
    description: 'Contact form completion rate is 12% below industry average. Simplifying forms could increase submissions.',
    impact: 'Medium Impact',
    source: 'Leads',
    icon: AlertCircle,
    actionable: true
  }
];
