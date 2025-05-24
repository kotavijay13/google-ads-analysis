
export const getImpactColor = (impact: string) => {
  switch (impact) {
    case 'High Impact':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'Medium Impact':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Low Impact':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getSourceColor = (source: string) => {
  switch (source) {
    case 'Google Ads':
      return 'bg-green-100 text-green-800';
    case 'Meta Ads':
      return 'bg-blue-100 text-blue-800';
    case 'SEO':
      return 'bg-purple-100 text-purple-800';
    case 'Leads':
      return 'bg-orange-100 text-orange-800';
    case 'Competition':
      return 'bg-pink-100 text-pink-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
