
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Instagram, Facebook, MessageSquare as WhatsAppIcon } from 'lucide-react';

const platforms = [
  {
    value: 'whatsapp',
    name: 'WhatsApp',
    icon: <WhatsAppIcon className="h-5 w-5" />,
    description: "Connect your WhatsApp Business account to manage conversations directly from Merge Insights AI.",
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
];

const ChatsPage = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <Header title="Chats" onRefresh={handleRefresh} />
      
      <p className="text-muted-foreground mb-8">
        Unify your customer conversations. Connect your social media and messaging platforms to manage all chats from a single inbox.
      </p>

      <Tabs defaultValue="whatsapp" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          {platforms.map((platform) => (
            <TabsTrigger key={platform.value} value={platform.value} className="flex items-center gap-2">
              {platform.icon}
              {platform.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {platforms.map((platform) => (
          <TabsContent key={platform.value} value={platform.value}>
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="flex items-center">
                  {platform.icon}
                  <span className="ml-2">Integrate {platform.name}</span>
                </CardTitle>
                <CardDescription>
                  {platform.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-start space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Once connected, you will be able to view and reply to your {platform.name} messages here.
                  </p>
                  <Button className={platform.color}>
                    Connect {platform.name}
                  </Button>
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
