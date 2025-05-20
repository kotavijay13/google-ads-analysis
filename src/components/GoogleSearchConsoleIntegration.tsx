
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSearchConsoleIntegration } from './google-search-console/useSearchConsoleIntegration';
import ConnectionStatus from './google-search-console/ConnectionStatus';
import PropertySelector from './google-search-console/PropertySelector';
import PropertyForm from './google-search-console/PropertyForm';
import PropertiesList from './google-search-console/PropertiesList';
import SyncActions from './google-search-console/SyncActions';
import ConnectButton from './google-search-console/ConnectButton';

const GoogleSearchConsoleIntegration = () => {
  const {
    isLoading,
    websiteUrl,
    connected,
    properties,
    selectedProperty,
    setWebsiteUrl,
    handleConnect,
    handleDisconnect,
    handleAddProperty,
    handleSelectProperty,
    handleSyncData
  } = useSearchConsoleIntegration();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Google Search Console Integration</CardTitle>
        <CardDescription>
          Connect to Google Search Console to import your SEO data
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!connected ? (
          <ConnectButton isLoading={isLoading} onConnect={handleConnect} />
        ) : (
          <div className="space-y-4">
            <ConnectionStatus 
              connected={connected} 
              isLoading={isLoading} 
              onDisconnect={handleDisconnect} 
            />
            
            <PropertySelector 
              properties={properties} 
              selectedProperty={selectedProperty} 
              onSelectProperty={handleSelectProperty} 
            />
            
            <PropertyForm 
              websiteUrl={websiteUrl} 
              isLoading={isLoading} 
              onWebsiteUrlChange={setWebsiteUrl} 
              onAddProperty={handleAddProperty} 
            />
            
            <PropertiesList 
              properties={properties} 
              selectedProperty={selectedProperty} 
            />
            
            <SyncActions 
              isLoading={isLoading} 
              selectedProperty={selectedProperty} 
              onSync={handleSyncData} 
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoogleSearchConsoleIntegration;
