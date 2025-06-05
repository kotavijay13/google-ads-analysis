
import { useState } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, BarChart3 } from 'lucide-react';
import WebsiteFormConnector from '@/components/WebsiteFormConnector';

const FormsPage = () => {
  const [activeTab, setActiveTab] = useState('all');

  const handleRefresh = () => {
    // Refresh forms data
    console.log('Refreshing forms data...');
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <Header onRefresh={handleRefresh} title="Forms Management" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-lg font-medium">Forms Overview</h2>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Form
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Forms</TabsTrigger>
          <TabsTrigger value="website">Website</TabsTrigger>
          <TabsTrigger value="manual">Manual</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Forms Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No forms data available</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Create or connect forms to see performance metrics
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Form Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No recent submissions</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Form submissions will appear here
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="website">
          <WebsiteFormConnector />
        </TabsContent>

        <TabsContent value="manual">
          <Card>
            <CardHeader>
              <CardTitle>Manual Form Creation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                <p className="text-muted-foreground">Manual form builder coming soon</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Create custom forms with drag-and-drop interface
                </p>
                <Button className="mt-4" disabled>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Manual Form
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FormsPage;
