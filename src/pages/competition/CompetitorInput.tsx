
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader } from 'lucide-react';
import { Competitor } from './types';

interface CompetitorInputProps {
  competitor: Competitor;
  onUrlChange: (url: string) => void;
  onAnalyze: () => void;
  competitorLabel: string;
}

const CompetitorInput = ({ competitor, onUrlChange, onAnalyze, competitorLabel }: CompetitorInputProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analyze {competitorLabel} Competitor</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input 
              placeholder="Enter competitor website URL (e.g., example.com)" 
              value={competitor.url}
              onChange={(e) => onUrlChange(e.target.value)}
              className="w-full"
            />
          </div>
          <Button 
            onClick={onAnalyze} 
            disabled={!competitor.url || competitor.loading}
            className="gap-2"
          >
            {competitor.loading ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                Analyze
                <Search className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompetitorInput;
