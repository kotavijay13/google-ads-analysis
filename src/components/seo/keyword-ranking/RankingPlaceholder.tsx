
import { BarChart3 } from 'lucide-react';

const RankingPlaceholder = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="text-center p-8">
        <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-150 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <BarChart3 className="w-12 h-12 text-gray-400" />
        </div>
        <h4 className="text-lg font-semibold text-gray-700 mb-2">No Data Available</h4>
        <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
          Select a website and refresh data to view keyword ranking performance and distribution.
        </p>
      </div>
    </div>
  );
};

export default RankingPlaceholder;
