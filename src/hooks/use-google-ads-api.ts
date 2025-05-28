
import { useState } from 'react';
import { toast } from './use-toast';
import { supabase } from '@/integrations/supabase/client';

interface GoogleAdsData {
  isLoading: boolean;
  error: string | null;
  campaigns?: any[];
  keywords?: any[];
  adGroups?: any[];
  metrics?: any;
  deviceData?: any[];
  geoData?: any[];
  dailyPerformance?: any[];
  adCopies?: any[];
  assets?: any[];
}

export function useGoogleAdsAPI() {
  const [data, setData] = useState<GoogleAdsData>({ 
    isLoading: false, 
    error: null 
  });

  /**
   * Fetch real Google Ads data from the API
   */
  const fetchData = async (startDate: Date, endDate: Date) => {
    // Show loading state
    setData(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Get the current selected account from localStorage
      const selectedAccountId = localStorage.getItem('selectedGoogleAdsAccount');
      
      if (!selectedAccountId) {
        console.log('No Google Ads account selected');
        setData(prev => ({ ...prev, isLoading: false }));
        toast({
          title: "No account selected",
          description: "Please select a Google Ads account first",
          variant: "destructive"
        });
        return;
      }
      
      console.log(`Fetching real data for account ${selectedAccountId}`);
      console.log(`Date range: ${startDate.toISOString()} to ${endDate.toISOString()}`);
      
      // Call the Google Ads data fetch function
      const { data: fetchResult, error } = await supabase.functions.invoke('google-ads-data', {
        body: {
          accountId: selectedAccountId,
          startDate: startDate.toISOString().split('T')[0], // YYYY-MM-DD format
          endDate: endDate.toISOString().split('T')[0]
        }
      });

      if (error) {
        console.error('Error fetching Google Ads data:', error);
        throw new Error(error.message || 'Failed to fetch Google Ads data');
      }

      if (fetchResult) {
        console.log('Received real Google Ads data:', fetchResult);
        
        // Update state with real data
        setData(prev => ({ 
          ...prev, 
          isLoading: false,
          campaigns: fetchResult.campaigns || [],
          keywords: fetchResult.keywords || [],
          adGroups: fetchResult.adGroups || [],
          metrics: fetchResult.metrics || {},
          deviceData: fetchResult.deviceData || [],
          geoData: fetchResult.geoData || [],
          dailyPerformance: fetchResult.dailyPerformance || [],
          adCopies: fetchResult.adCopies || [],
          assets: fetchResult.assets || []
        }));
        
        // Success notification
        toast({
          title: "Data refreshed",
          description: `Successfully fetched real data for account ${selectedAccountId}`
        });
      } else {
        throw new Error('No data returned from API');
      }
      
    } catch (error) {
      console.error('Error fetching Google Ads data:', error);
      setData(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }));
      
      // Error notification
      toast({
        title: "Error refreshing data",
        description: error instanceof Error ? error.message : "Failed to fetch Google Ads data. Please try again.",
        variant: "destructive"
      });
    }
  };

  /**
   * This function would handle authentication with Google
   * and connect to the user's Google Ads accounts
   */
  const connectGoogleAccount = async (email: string) => {
    try {
      console.log(`Connecting Google account: ${email}`);
      // In a real implementation, this would initiate OAuth flow
      
      toast({
        title: "Google account connected",
        description: `Successfully linked ${email}`
      });
      
      return true;
    } catch (error) {
      console.error('Error connecting Google account:', error);
      
      toast({
        title: "Connection failed",
        description: "Could not connect Google account. Please try again.",
        variant: "destructive"
      });
      
      return false;
    }
  };

  return {
    ...data,
    fetchData,
    connectGoogleAccount
  };
}
