
import { Globe } from 'lucide-react';

const SEOHeader = () => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <div className="text-primary p-2 bg-primary/10 rounded-lg">
          <Globe className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">SEO Detailed Report</h1>
          <p className="text-muted-foreground text-sm">
            Comprehensive SEO analytics and insights
          </p>
        </div>
      </div>
    </div>
  );
};

export default SEOHeader;
