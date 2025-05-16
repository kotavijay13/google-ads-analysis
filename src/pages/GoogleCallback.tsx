
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';
import { Loader2 } from 'lucide-react';

const GoogleCallback = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const processCallback = async () => {
      if (!user) {
        navigate('/auth');
        return;
      }

      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const error = urlParams.get('error');
        const storedState = localStorage.getItem('googleOAuthState');
        
        // Clear the state from localStorage
        localStorage.removeItem('googleOAuthState');

        if (error) {
          throw new Error(`OAuth error: ${error}`);
        }

        if (!code) {
          throw new Error('No authorization code received');
        }

        if (state !== storedState) {
          throw new Error('OAuth state mismatch');
        }

        // Call our secure edge function to exchange the code for tokens
        const { data, error: functionError } = await supabase.functions.invoke('google-ads-auth', {
          body: { code, redirectUri: window.location.origin + '/google-callback' }
        });

        if (functionError || !data) {
          throw new Error(functionError?.message || 'Failed to get Google access token');
        }

        toast.success('Successfully connected to Google Ads');
        navigate('/integrations');
      } catch (error) {
        console.error('Google OAuth callback error:', error);
        toast.error((error as Error).message || 'Failed to connect to Google Ads');
        navigate('/integrations');
      } finally {
        setProcessing(false);
      }
    };

    processCallback();
  }, [user, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center p-6">
          <Loader2 className="h-8 w-8 animate-spin mb-2" />
          <h2 className="text-xl font-semibold mt-4">Processing Google Authentication</h2>
          <p className="text-muted-foreground mt-2">Please wait while we connect your Google Ads account...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleCallback;
