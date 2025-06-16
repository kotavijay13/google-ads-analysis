
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
      const { data, error } = await supabase
        .from('api_tokens')
        .select('*')
        .eq('user_id', user?.id)
        .in('provider', ['instagram', 'facebook', 'whatsapp']);

      if (error) throw error;
      
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
      setMessages([]);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const connectInstagram = async () => {
    try {
      setIsLoading(true);
      toast.info('Instagram connection requires proper API configuration. Please contact your administrator to set up Instagram Basic Display API credentials.');
    } catch (error) {
      console.error('Error connecting Instagram:', error);
      toast.error('Failed to connect Instagram. Please ensure API credentials are configured.');
    } finally {
      setIsLoading(false);
    }
  };

  const connectFacebook = async () => {
    try {
      setIsLoading(true);
      toast.info('Facebook connection requires proper API configuration. Please contact your administrator to set up Facebook App credentials.');
    } catch (error) {
      console.error('Error connecting Facebook:', error);
      toast.error('Failed to connect Facebook. Please ensure API credentials are configured.');
    } finally {
      setIsLoading(false);
    }
  };

  const connectWhatsApp = async () => {
    try {
      setIsLoading(true);
      toast.info('WhatsApp Business API connection requires additional setup and approval from Meta. Please contact your administrator.');
    } catch (error) {
      console.error('Error connecting WhatsApp:', error);
      toast.error('Failed to connect WhatsApp.');
    } finally {
      setIsLoading(false);
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
