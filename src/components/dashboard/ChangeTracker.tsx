
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle, AlertCircle, TrendingUp, Search, Facebook, Users, Target } from 'lucide-react';

interface Change {
  id: string;
  title: string;
  description: string;
  priority: 'High Impact' | 'Medium Impact' | 'Low Impact';
  category: string;
  completed: boolean;
  icon: any;
}

const initialChanges: Change[] = [
  {
    id: '1',
    title: "Increase bid for 'digital marketing' keyword",
    description: 'Currently underperforming with high potential ROI',
    priority: 'High Impact',
    category: 'Google Ads',
    completed: false,
    icon: TrendingUp
  },
  {
    id: '2',
    title: 'Optimize meta descriptions for top 5 landing pages',
    description: 'Current CTR is below average',
    priority: 'Medium Impact',
    category: 'SEO',
    completed: false,
    icon: Search
  },
  {
    id: '3',
    title: 'Refresh creative for Instagram Story campaign',
    description: 'Engagement dropping over the past week',
    priority: 'High Impact',
    category: 'Meta Ads',
    completed: false,
    icon: Facebook
  },
  {
    id: '4',
    title: "Target competitor keyword 'marketing automation'",
    description: 'Competitor ranking dropped, opportunity to gain position',
    priority: 'Medium Impact',
    category: 'Competition',
    completed: false,
    icon: Target
  },
  {
    id: '5',
    title: 'Follow up with 12 high-value leads',
    description: "Leads from last week's campaign waiting for response",
    priority: 'High Impact',
    category: 'Leads',
    completed: false,
    icon: Users
  }
];

const ChangeTracker = () => {
  const [changes, setChanges] = useState<Change[]>(initialChanges);

  const toggleChange = (id: string) => {
    setChanges(prev => 
      prev.map(change => 
        change.id === id 
          ? { ...change, completed: !change.completed }
          : change
      )
    );
  };

  const completedCount = changes.filter(change => change.completed).length;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High Impact': return 'text-red-600 bg-red-50 border-red-200';
      case 'Medium Impact': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Low Impact': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Google Ads': return 'text-blue-600';
      case 'Meta Ads': return 'text-blue-800';
      case 'SEO': return 'text-green-600';
      case 'Competition': return 'text-purple-600';
      case 'Leads': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Top 5 Changes To Be Done Today</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {changes.map((change) => {
          const IconComponent = change.icon;
          return (
            <div 
              key={change.id} 
              className={`flex items-start gap-4 p-4 rounded-lg border transition-all duration-200 ${
                change.completed 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-gray-100">
                  <IconComponent className="h-4 w-4 text-gray-600" />
                </div>
                <button
                  onClick={() => toggleChange(change.id)}
                  className="transition-colors"
                >
                  {change.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              
              <div className="flex-1">
                <h4 className={`font-medium mb-1 ${change.completed ? 'text-green-800 line-through' : 'text-gray-900'}`}>
                  {change.title}
                </h4>
                <p className={`text-sm mb-2 ${change.completed ? 'text-green-600' : 'text-gray-600'}`}>
                  {change.description}
                </p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span className={`text-xs font-medium px-2 py-1 rounded border ${getPriorityColor(change.priority)}`}>
                  {change.priority}
                </span>
                <span className={`text-xs font-medium ${getCategoryColor(change.category)}`}>
                  {change.category}
                </span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default ChangeTracker;
