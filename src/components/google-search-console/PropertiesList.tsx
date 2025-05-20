
import { Check, ExternalLink } from 'lucide-react';
import { SearchConsoleProperty } from './types';

interface PropertiesListProps {
  properties: SearchConsoleProperty[];
  selectedProperty: string | null;
}

const PropertiesList = ({ properties, selectedProperty }: PropertiesListProps) => {
  return (
    <div className="bg-muted/50 p-4 rounded-md">
      <h3 className="text-sm font-medium mb-2">Connected Properties</h3>
      {properties.length > 0 ? (
        properties.map((property, index) => (
          <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
            <div className="flex items-center gap-2">
              {selectedProperty === property.url && (
                <Check className="h-4 w-4 text-green-500" />
              )}
              <span className={`font-medium ${selectedProperty === property.url ? 'text-green-600' : ''}`}>
                {property.name}
              </span>
            </div>
            <a 
              href={property.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
            >
              Visit <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </div>
        ))
      ) : (
        <p className="text-center text-muted-foreground py-2">No properties added yet</p>
      )}
    </div>
  );
};

export default PropertiesList;
