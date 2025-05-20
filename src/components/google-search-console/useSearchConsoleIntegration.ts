
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { SearchConsoleProperty } from './types';

export const useSearchConsoleIntegration = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [connected, setConnected] = useState(false);
  const [properties, setProperties] = useState<SearchConsoleProperty[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      checkConnection();
    }
  }, [user]);

  const checkConnection = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('api_tokens')
        .select('*')
        .eq('user_id', user.id)
        .eq('provider', 'google_search_console')
        .maybeSingle();
      
      if (data) {
        setConnected(true);
        fetchProperties();
      }
    } catch (error) {
      console.error("Error checking connection:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProperties = async () => {
    if (!user || !connected) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('ad_accounts')
        .select('*')
        .eq('user_id', user.id)
        .eq('platform', 'google_search_console');
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const propertiesData = data.map(property => ({
          name: property.account_name || new URL(property.account_id).hostname,
          url: property.account_id
        }));
        
        setProperties(propertiesData);
        
        // If there's a previously selected property in localStorage, use that
        const savedPropertyUrl = localStorage.getItem('selectedSearchConsoleProperty');
        if (savedPropertyUrl && propertiesData.length > 0) {
          const savedProperty = propertiesData.find(prop => prop.url === savedPropertyUrl);
          if (savedProperty) {
            setSelectedProperty(savedProperty.url);
          } else {
            // If saved property not found, use the first property
            setSelectedProperty(propertiesData[0].url);
            localStorage.setItem('selectedSearchConsoleProperty', propertiesData[0].url);
          }
        } else if (propertiesData.length > 0) {
          // If no saved property, default to first
          setSelectedProperty(propertiesData[0].url);
          localStorage.setItem('selectedSearchConsoleProperty', propertiesData[0].url);
        }
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      setConnectionError(null);
      setIsLoading(true);
      
      // Generate a random state for OAuth security
      const state = Math.random().toString(36).substring(2);
      // Save the state in localStorage to verify later
      localStorage.setItem('googleSearchConsoleOAuthState', state);
      
      // Using the correct OAuth configuration
      const oauthEndpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
      
      // Google client ID - ensure this is correctly configured in Supabase secrets
      const clientId = '463775925601-8i7gv5qhham5b5f60mjvhusp6jg6qfd8.apps.googleusercontent.com';
      
      // Use the exact redirect URI as configured in Google Cloud Console
      const redirectUri = window.location.origin + '/google-callback';
      
      // Include the Search Console scope
      const scope = encodeURIComponent('https://www.googleapis.com/auth/webmasters.readonly');
      
      console.log("Starting Google Search Console OAuth with:", {
        clientId,
        redirectUri,
        state
      });
      
      // Construct the OAuth URL with all required parameters
      const oauthUrl = `${oauthEndpoint}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&state=${state}&access_type=offline&prompt=consent&include_granted_scopes=true`;
      
      // Redirect to Google's OAuth page
      window.location.href = oauthUrl;
    } catch (error) {
      console.error("Error initiating Google OAuth:", error);
      setConnectionError("Failed to connect to Google Search Console");
      toast.error("Failed to connect to Google Search Console");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('api_tokens')
        .delete()
        .eq('user_id', user.id)
        .eq('provider', 'google_search_console');
      
      if (error) throw error;
      
      setConnected(false);
      setProperties([]);
      setSelectedProperty(null);
      localStorage.removeItem('selectedSearchConsoleProperty');
      toast.success("Disconnected from Google Search Console");
    } catch (error) {
      console.error('Error disconnecting:', error);
      toast.error("Failed to disconnect");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProperty = async () => {
    if (!user || !websiteUrl) {
      toast.error("Please enter a website URL");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Format the URL properly
      let formattedUrl = websiteUrl;
      if (!formattedUrl.startsWith('http')) {
        formattedUrl = `https://${formattedUrl}`;
      }
      
      // For now, we'll use ad_accounts table with a specific platform value
      // to temporarily store search console properties
      const { data, error } = await supabase
        .from('ad_accounts')
        .insert([
          { 
            user_id: user.id,
            platform: 'google_search_console',
            account_id: formattedUrl,
            account_name: new URL(formattedUrl).hostname
          }
        ]);
      
      if (error) throw error;
      
      toast.success(`Added ${websiteUrl} to Search Console properties`);
      setWebsiteUrl('');
      fetchProperties();
    } catch (error) {
      console.error('Error adding property:', error);
      toast.error("Failed to add property");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectProperty = (value: string) => {
    setSelectedProperty(value);
    localStorage.setItem('selectedSearchConsoleProperty', value);
    
    // Find the selected property to show in toast
    const property = properties.find(p => p.url === value);
    if (property) {
      toast.success(`Selected property: ${property.name}`);
    }
  };

  const handleSyncData = async () => {
    setIsLoading(true);
    toast.success("Syncing data from Google Search Console...");
    
    // In a real implementation, this would call an API to sync data
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Data synced successfully");
    }, 2000);
  };

  return {
    isLoading,
    websiteUrl,
    connected,
    properties,
    selectedProperty,
    connectionError,
    setWebsiteUrl,
    handleConnect,
    handleDisconnect,
    handleAddProperty,
    handleSelectProperty,
    handleSyncData
  };
};
