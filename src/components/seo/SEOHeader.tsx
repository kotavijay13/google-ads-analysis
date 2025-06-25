
import { Globe, TrendingUp } from 'lucide-react';

const SEOHeader = () => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="text-primary p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
            <Globe className="w-7 h-7 text-white" />
          </div>
          <div className="absolute -top-1 -right-1 p-1 bg-green-500 rounded-full">
            <TrendingUp className="w-3 h-3 text-white" />
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
            SEO Report
          </h1>
          <p className="text-muted-foreground text-base mt-1">
            Comprehensive SEO analytics and insights
          </p>
        </div>
      </div>
    </div>
  );
};

export default SEOHeader;
