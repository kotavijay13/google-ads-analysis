
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Instagram, Facebook, MessageSquare as WhatsAppIcon, Loader2, Globe } from 'lucide-react';
import { useSocialMediaIntegration } from '@/hooks/useSocialMediaIntegration';

const platforms = [
  {
    value: 'whatsapp',
    name: 'WhatsApp',
    icon: <WhatsAppIcon className="h-5 w-5" />,
    description: "Connect your WhatsApp Business account to manage conversations directly from MyGGAI Insights.",
    color: 'bg-green-500 hover:bg-green-600 text-white',
  },
  {
    value: 'instagram',
    name: 'Instagram',
    icon: <Instagram className="h-5 w-5" />,
    description: "Connect your Instagram account to reply to DMs and story mentions without leaving the app.",
    color: 'bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white hover:opacity-90',
  },
  {
    value: 'facebook',
    name: 'Facebook Messenger',
    icon: <Facebook className="h-5 w-5" />,
    description: "Integrate Facebook Messenger to handle all your customer messages in one place.",
    color: 'bg-blue-600 hover:bg-blue-700 text-white',
  },
  {
    value: 'website',
    name: 'Website Chats',
    icon: <Globe className="h-5 w-5" />,
    description: "Connect your website chatbot to capture leads and manage conversations from your website visitors.",
    color: 'bg-green-600 hover:bg-green-700 text-white',
  },
];

const ChatsPage = () => {
  const {
    connectedAccounts,
    messages,
    isLoading,
    connectInstagram,
    connectFacebook,
    connectWhatsApp,
    disconnectAccount,
  } = useSocialMediaIntegration();

  const handleRefresh = () => {
    window.location.reload();
  };

  const isConnected = (platform: string) => {
    return connectedAccounts.some(account => account.platform === platform);
  };

  const handleConnect = (platform: string) => {
    switch (platform) {
      case 'instagram':
        connectInstagram();
        break;
      case 'facebook':
        connectFacebook();
        break;
      case 'whatsapp':
        connectWhatsApp();
        break;
      case 'website':
        // Handle website chat connection
        console.log('Connecting website chats...');
        break;
      default:
        console.error('Unknown platform:', platform);
    }
  };

  const handleDisconnect = (platform: string) => {
    const account = connectedAccounts.find(acc => acc.platform === platform);
    if (account) {
      disconnectAccount(account.id);
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <Header title="Chats" onRefresh={handleRefresh} />
      
      <p className="text-muted-foreground mb-8">
        Unify your customer conversations. Connect your social media and messaging platforms to manage all chats from a single inbox.
      </p>

      <Tabs defaultValue="whatsapp" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          {platforms.map((platform) => (
            <TabsTrigger 
              key={platform.value} 
              value={platform.value} 
              className="flex items-center gap-2 data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              {platform.icon}
              <span className="hidden sm:inline">{platform.name}</span>
              {isConnected(platform.value) && (
                <Badge className="ml-2 bg-green-500 text-white text-xs">Connected</Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
        {platforms.map((platform) => (
          <TabsContent key={platform.value} value={platform.value}>
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    {platform.icon}
                    <span className="ml-2">Integrate {platform.name}</span>
                  </div>
                  {isConnected(platform.value) && (
                    <Badge className="bg-green-500 text-white">Connected</Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  {platform.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-start space-y-4">
                  {!isConnected(platform.value) ? (
                    <>
                      <p className="text-sm text-muted-foreground">
                        {platform.value === 'website' 
                          ? "Once connected, you will be able to view and manage leads generated from your website chatbot here."
                          : `Once connected, you will be able to view and reply to your ${platform.name} messages here.`
                        }
                      </p>
                      <Button 
                        className={platform.color}
                        onClick={() => handleConnect(platform.value)}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Connecting...
                          </>
                        ) : (
                          <>Connect {platform.name}</>
                        )}
                      </Button>
                      {platform.value === 'website' && (
                        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                          <h4 className="font-semibold text-green-800 mb-2">Integration Instructions:</h4>
                          <p className="text-sm text-green-700">
                            To connect your chatbot app with this dashboard, you'll need to configure the webhook URL in your chatbot application to send lead data to this platform.
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-green-600">
                        ✅ {platform.name} is successfully connected! You can now manage your messages from this platform.
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline">
                          View Messages ({messages.filter(m => m.platform === platform.value).length})
                        </Button>
                        <Button 
                          variant="destructive"
                          onClick={() => handleDisconnect(platform.value)}
                        >
                          Disconnect
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ChatsPage;
