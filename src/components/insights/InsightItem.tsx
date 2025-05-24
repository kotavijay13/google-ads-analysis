
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AIInsight } from './types';
import { getImpactColor, getSourceColor } from './utils';

interface InsightItemProps {
  insight: AIInsight;
  isCompleted: boolean;
  onMarkComplete: (insightId: string) => void;
}

const InsightItem = ({ insight, isCompleted, onMarkComplete }: InsightItemProps) => {
  const IconComponent = insight.icon;
  
  return (
    <div 
      className={`p-4 border rounded-lg transition-all ${
        isCompleted ? 'bg-green-50 border-green-200 opacity-75' : 'bg-white hover:shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <IconComponent size={16} />
          <h4 className={`font-medium text-sm ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
            {insight.title}
          </h4>
        </div>
        {!isCompleted && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onMarkComplete(insight.id)}
            className="h-6 px-2 text-xs"
          >
            Done
          </Button>
        )}
      </div>
      
      <p className={`text-xs mb-3 ${isCompleted ? 'text-muted-foreground' : 'text-gray-600'}`}>
        {insight.description}
      </p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className={`text-xs ${getImpactColor(insight.impact)}`}>
            {insight.impact}
          </Badge>
          <Badge variant="secondary" className={`text-xs ${getSourceColor(insight.source)}`}>
            {insight.source}
          </Badge>
        </div>
        {isCompleted && (
          <Badge variant="outline" className="bg-green-100 text-green-800 text-xs">
            Completed
          </Badge>
        )}
      </div>
    </div>
  );
};

export default InsightItem;
