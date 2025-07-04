
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AIInsight } from './types';
import { CheckCircle, ExternalLink, Link, Hash, FileText, Lightbulb } from 'lucide-react';

interface InsightItemProps {
  insight: AIInsight;
  isCompleted: boolean;
  onMarkComplete: (insightId: string) => void;
}

const InsightItem = ({ insight, isCompleted, onMarkComplete }: InsightItemProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getChannelColor = (channel: string) => {
    switch (channel) {
      case 'seo': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'google-ads': return 'bg-green-100 text-green-800 border-green-200';
      case 'meta-ads': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'leads': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'cross-channel': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  return (
    <Card className={`transition-all ${
      isCompleted ? 'bg-green-50 border-green-200 opacity-75' : 'bg-white hover:shadow-sm'
    }`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Lightbulb size={16} className="text-primary" />
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
              <CheckCircle size={12} className="mr-1" />
              Done
            </Button>
          )}
        </div>
        
        <p className={`text-xs mb-3 ${isCompleted ? 'text-muted-foreground' : 'text-gray-600'}`}>
          {insight.description}
        </p>

        {/* Specific Recommendations Section */}
        {insight.recommendations && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <h5 className="text-xs font-semibold mb-2 flex items-center">
              <FileText size={12} className="mr-1" />
              Specific Recommendations:
            </h5>
            
            {insight.recommendations.metaTitle && (
              <div className="mb-2">
                <span className="text-xs font-medium text-blue-700">Meta Title:</span>
                <p className="text-xs text-gray-700 bg-white p-2 rounded border mt-1">
                  {insight.recommendations.metaTitle}
                </p>
              </div>
            )}

            {insight.recommendations.metaDescription && (
              <div className="mb-2">
                <span className="text-xs font-medium text-blue-700">Meta Description:</span>
                <p className="text-xs text-gray-700 bg-white p-2 rounded border mt-1">
                  {insight.recommendations.metaDescription}
                </p>
              </div>
            )}

            {insight.recommendations.headerTags && insight.recommendations.headerTags.length > 0 && (
              <div className="mb-2">
                <span className="text-xs font-medium text-purple-700 flex items-center">
                  <Hash size={12} className="mr-1" />
                  Header Tags:
                </span>
                <div className="mt-1 space-y-1">
                  {insight.recommendations.headerTags.map((tag, index) => (
                    <p key={index} className="text-xs text-gray-700 bg-white p-2 rounded border">
                      {tag}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {insight.recommendations.keywordDensity && (
              <div className="mb-2">
                <span className="text-xs font-medium text-green-700">Keyword Density:</span>
                <p className="text-xs text-gray-700 bg-white p-2 rounded border mt-1">
                  {insight.recommendations.keywordDensity}
                </p>
              </div>
            )}

            {insight.recommendations.internalLinks && insight.recommendations.internalLinks.length > 0 && (
              <div className="mb-2">
                <span className="text-xs font-medium text-indigo-700 flex items-center">
                  <Link size={12} className="mr-1" />
                  Internal Links:
                </span>
                <div className="mt-1 space-y-1">
                  {insight.recommendations.internalLinks.map((link, index) => (
                    <p key={index} className="text-xs text-gray-700 bg-white p-2 rounded border">
                      {link}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {insight.recommendations.externalLinks && insight.recommendations.externalLinks.length > 0 && (
              <div className="mb-2">
                <span className="text-xs font-medium text-orange-700 flex items-center">
                  <ExternalLink size={12} className="mr-1" />
                  External Links:
                </span>
                <div className="mt-1 space-y-1">
                  {insight.recommendations.externalLinks.map((link, index) => (
                    <p key={index} className="text-xs text-gray-700 bg-white p-2 rounded border">
                      {link}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {insight.recommendations.technicalSeo && insight.recommendations.technicalSeo.length > 0 && (
              <div className="mb-2">
                <span className="text-xs font-medium text-red-700">Technical SEO:</span>
                <div className="mt-1 space-y-1">
                  {insight.recommendations.technicalSeo.map((item, index) => (
                    <p key={index} className="text-xs text-gray-700 bg-white p-2 rounded border">
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <Separator className="my-3" />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className={`text-xs ${getPriorityColor(insight.priority)}`}>
              {insight.priority} priority
            </Badge>
            <Badge variant="secondary" className={`text-xs ${getChannelColor(insight.channel)}`}>
              {insight.channel}
            </Badge>
          </div>
          {isCompleted && (
            <Badge variant="outline" className="bg-green-100 text-green-800 text-xs">
              Completed
            </Badge>
          )}
        </div>

        {insight.action && (
          <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-200">
            <p className="text-xs text-blue-800">
              <strong>Action:</strong> {insight.action}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InsightItem;
