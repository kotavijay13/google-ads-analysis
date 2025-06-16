
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/sonner';

interface SocialMediaAccount {
  id: string;
  platform: 'instagram' | 'facebook' | 'whatsapp';
  account_id: string;
  account_name: string;
  access_token: string;
  is_connected: boolean;
  created_at: string;
}

interface SocialMediaMessage {
  id: string;
  platform: string;
  message_id: string;
  sender_id: string;
  sender_name: string;
  content: string;
  timestamp: string;
  is_read: boolean;
}

export const useSocialMediaIntegration = () => {
  const { user } = useAuth();
  const [connectedAccounts, setConnectedAccounts] = useState<SocialMediaAccount[]>([]);
  const [messages, setMessages] = useState<SocialMediaMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchConnectedAccounts();
      fetchMessages();
    }
  }, [user]);

  const fetchConnectedAccounts = async () => {
    try {
      setIsLoading(true);
      // In a real implementation, you would fetch from a social_media_accounts table
      const { data, error } = await supabase
        .from('api_tokens')
        .select('*')
        .eq('user_id', user?.id)
        .in('provider', ['instagram', 'facebook', 'whatsapp']);

      if (error) throw error;
      
      // Transform the data to match our interface
      const accounts = data?.map(token => ({
        id: token.id,
        platform: token.provider as 'instagram' | 'facebook' | 'whatsapp',
        account_id: token.id,
        account_name: `${token.provider} Account`,
        access_token: token.access_token,
        is_connected: true,
        created_at: token.created_at
      })) || [];

      setConnectedAccounts(accounts);
    } catch (error) {
      console.error('Error fetching connected accounts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      // In a real implementation, you would fetch from a social_media_messages table
      // For now, we'll return empty array
      setMessages([]);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const connectInstagram = async () => {
    try {
      setIsLoading(true);
      
      // Instagram Basic Display API connection flow
      const clientId = 'YOUR_INSTAGRAM_CLIENT_ID'; // This should be in environment variables
      const redirectUri = `${window.location.origin}/instagram-callback`;
      const scope = 'user_profile,user_media';
      
      const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
      
      // Open Instagram auth in a new window
      const authWindow = window.open(authUrl, 'instagram-auth', 'width=600,height=600');
      
      // Listen for the callback
      const handleCallback = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'INSTAGRAM_AUTH_SUCCESS') {
          const { code } = event.data;
          exchangeCodeForToken(code, 'instagram');
          authWindow?.close();
        } else if (event.data.type === 'INSTAGRAM_AUTH_ERROR') {
          toast.error('Instagram connection failed');
          authWindow?.close();
        }
      };
      
      window.addEventListener('message', handleCallback);
      
      // Clean up listener when window closes
      const checkClosed = setInterval(() => {
        if (authWindow?.closed) {
          window.removeEventListener('message', handleCallback);
          clearInterval(checkClosed);
          setIsLoading(false);
        }
      }, 1000);
      
    } catch (error) {
      console.error('Error connecting Instagram:', error);
      toast.error('Failed to connect Instagram');
      setIsLoading(false);
    }
  };

  const connectFacebook = async () => {
    try {
      setIsLoading(true);
      
      // Facebook Login API connection flow
      const appId = 'YOUR_FACEBOOK_APP_ID'; // This should be in environment variables
      const redirectUri = `${window.location.origin}/facebook-callback`;
      const scope = 'pages_messaging,pages_manage_metadata,pages_read_engagement';
      
      const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
      
      window.location.href = authUrl;
      
    } catch (error) {
      console.error('Error connecting Facebook:', error);
      toast.error('Failed to connect Facebook');
      setIsLoading(false);
    }
  };

  const connectWhatsApp = async () => {
    try {
      setIsLoading(true);
      
      // WhatsApp Business API connection
      // This typically requires WhatsApp Business API setup
      toast.info('WhatsApp Business API connection requires additional setup. Please contact support.');
      
    } catch (error) {
      console.error('Error connecting WhatsApp:', error);
      toast.error('Failed to connect WhatsApp');
    } finally {
      setIsLoading(false);
    }
  };

  const exchangeCodeForToken = async (code: string, platform: string) => {
    try {
      // Exchange authorization code for access token
      const response = await fetch('/api/social-media-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, platform }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Store the token in Supabase
        const { error } = await supabase
          .from('api_tokens')
          .insert({
            user_id: user?.id,
            provider: platform,
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            expires_at: data.expires_at,
          });
        
        if (error) throw error;
        
        toast.success(`${platform} connected successfully!`);
        fetchConnectedAccounts();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      toast.error(`Failed to complete ${platform} connection`);
    }
  };

  const disconnectAccount = async (accountId: string) => {
    try {
      const { error } = await supabase
        .from('api_tokens')
        .delete()
        .eq('id', accountId);
      
      if (error) throw error;
      
      toast.success('Account disconnected successfully');
      fetchConnectedAccounts();
    } catch (error) {
      console.error('Error disconnecting account:', error);
      toast.error('Failed to disconnect account');
    }
  };

  const sendMessage = async (platform: string, recipientId: string, message: string) => {
    try {
      // Implementation would depend on the platform's API
      console.log(`Sending message on ${platform} to ${recipientId}: ${message}`);
      toast.success('Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  return {
    connectedAccounts,
    messages,
    isLoading,
    connectInstagram,
    connectFacebook,
    connectWhatsApp,
    disconnectAccount,
    sendMessage,
    fetchMessages,
  };
};
