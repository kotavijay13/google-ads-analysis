
import { Badge } from '@/components/ui/badge';

export const pagesColumns = [
  {
    key: 'url',
    label: 'Page URL',
    sortable: true,
    render: (value: string) => (
      <span className="text-blue-600 font-medium">{value}</span>
    ),
  },
  {
    key: 'impressions',
    label: 'Impressions',
    sortable: true,
    className: 'text-right',
    render: (value: number) => value.toLocaleString(),
  },
  {
    key: 'clicks',
    label: 'Clicks',
    sortable: true,
    className: 'text-right',
    render: (value: number) => value.toLocaleString(),
  },
  {
    key: 'ctr',
    label: 'CTR (%)',
    sortable: true,
    className: 'text-right',
    render: (value: number) => `${value}%`,
  },
  {
    key: 'position',
    label: 'Avg Position',
    sortable: true,
    className: 'text-right',
  },
];

export const urlMetaDataColumns = [
  {
    key: 'url',
    label: 'URL',
    sortable: true,
    render: (value: string) => (
      <span 
        className="text-blue-600 font-medium max-w-xs truncate block" 
        title={value}
      >
        {value}
      </span>
    ),
  },
  {
    key: 'metaTitle',
    label: 'Meta Title',
    sortable: true,
    render: (value: string) => (
      <span 
        className="max-w-sm truncate block" 
        title={value || 'N/A'}
      >
        {value || 'N/A'}
      </span>
    ),
  },
  {
    key: 'metaDescription',
    label: 'Meta Description',
    sortable: true,
    render: (value: string) => (
      <span 
        className="max-w-sm truncate block" 
        title={value || 'N/A'}
      >
        {value || 'N/A'}
      </span>
    ),
  },
  {
    key: 'imageCount',
    label: 'Images',
    sortable: true,
    className: 'text-center',
    render: (value: number) => (
      <span className="font-medium">{value || 0}</span>
    ),
  },
  {
    key: 'imagesWithoutAlt',
    label: 'Missing Alt Text',
    sortable: true,
    className: 'text-center',
    render: (value: number) => (
      <Badge variant={value > 0 ? 'destructive' : 'default'}>
        {value || 0}
      </Badge>
    ),
  },
];
