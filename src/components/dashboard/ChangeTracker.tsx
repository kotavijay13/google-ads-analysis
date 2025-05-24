
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle, AlertTriangle, TrendingUp, Search, Facebook, Users, Target, RefreshCw, Loader2 } from 'lucide-react';

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

// Additional insights pool for refresh functionality
const additionalInsights: Change[] = [
  {
    id: '6',
    title: "Reduce CPC for 'online marketing' keywords",
    description: 'Cost per click 40% above benchmark, adjust bid strategy',
    priority: 'High Impact',
    category: 'Google Ads',
    completed: false,
    icon: TrendingUp
  },
  {
    id: '7',
    title: 'Test new Facebook ad copy variations',
    description: 'Current CTR declined 15% in past 3 days',
    priority: 'Medium Impact',
    category: 'Meta Ads',
    completed: false,
    icon: Facebook
  },
  {
    id: '8',
    title: 'Expand targeting to lookalike audiences',
    description: 'Similar audience segments showing 3x higher conversion rate',
    priority: 'High Impact',
    category: 'Meta Ads',
    completed: false,
    icon: Users
  },
  {
    id: '9',
    title: 'Pause underperforming display campaigns',
    description: 'ROI below 2.0, reallocate budget to search campaigns',
    priority: 'Medium Impact',
    category: 'Google Ads',
    completed: false,
    icon: AlertTriangle
  },
  {
    id: '10',
    title: 'Update negative keyword list',
    description: 'Irrelevant traffic consuming 12% of daily budget',
    priority: 'Medium Impact',
    category: 'Google Ads',
    completed: false,
    icon: Search
  },
  {
    id: '11',
    title: 'A/B test video vs image creatives',
    description: 'Video ads showing 25% higher engagement rate',
    priority: 'High Impact',
    category: 'Meta Ads',
    completed: false,
    icon: Facebook
  },
  {
    id: '12',
    title: 'Optimize landing page load speed',
    description: 'Page speed affecting conversion rate by 8%',
    priority: 'Medium Impact',
    category: 'SEO',
    completed: false,
    icon: Search
  }
];

const ChangeTracker = () => {
  const [changes, setChanges] = useState<Change[]>(initialChanges);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const toggleChange = (id: string) => {
    setChanges(prev => 
      prev.map(change => 
        change.id === id 
          ? { ...change, completed: !change.completed }
          : change
      )
    );
  };

  const refreshInsights = async () => {
    setIsRefreshing(true);
    
    // Simulate AI analysis across Google Ads and Meta Ads data
    setTimeout(() => {
      // Get random 5 insights from the pool (including initial ones)
      const allInsights = [...initialChanges, ...additionalInsights];
      const shuffled = allInsights.sort(() => 0.5 - Math.random());
      const newInsights = shuffled.slice(0, 5).map((insight, index) => ({
        ...insight,
        id: `${Date.now()}-${index}`, // Generate new IDs to reset completion status
        completed: false
      }));
      
      setChanges(newInsights);
      setIsRefreshing(false);
      console.log('AI insights refreshed - analyzed Google Ads and Meta Ads performance data');
    }, 2000);
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
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">Top 5 AI Insights for Today</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshInsights}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            {isRefreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            {isRefreshing ? 'Analyzing...' : 'Refresh'}
          </Button>
        </div>
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
