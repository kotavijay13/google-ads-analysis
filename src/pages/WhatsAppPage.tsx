
import { useState } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const mockWhatsAppData = {
  messageStats: [
    { date: '01/05', sent: 120, delivered: 118, read: 95 },
    { date: '02/05', sent: 145, delivered: 140, read: 110 },
    { date: '03/05', sent: 132, delivered: 130, read: 100 },
    { date: '04/05', sent: 165, delivered: 160, read: 125 },
    { date: '05/05', sent: 180, delivered: 175, read: 140 },
    { date: '06/05', sent: 190, delivered: 188, read: 150 },
    { date: '07/05', sent: 170, delivered: 168, read: 135 },
  ],
  campaignPerformance: [
    { name: 'Spring Sale', sent: 1200, responses: 420, conversion: 85 },
    { name: 'New Product', sent: 950, responses: 380, conversion: 72 },
    { name: 'Customer Survey', sent: 650, responses: 280, conversion: 45 },
    { name: 'Flash Deal', sent: 800, responses: 320, conversion: 65 },
  ],
  responseTime: [
    { hour: '9AM', avgResponseTime: 2.5 },
    { hour: '10AM', avgResponseTime: 3.2 },
    { hour: '11AM', avgResponseTime: 4.1 },
    { hour: '12PM', avgResponseTime: 5.5 },
    { hour: '1PM', avgResponseTime: 6.2 },
    { hour: '2PM', avgResponseTime: 4.5 },
    { hour: '3PM', avgResponseTime: 3.8 },
    { hour: '4PM', avgResponseTime: 2.9 },
    { hour: '5PM', avgResponseTime: 3.3 },
  ]
};

const WhatsAppPage = () => {
  const [activeCampaign, setActiveCampaign] = useState('all');
  
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <Header title="WhatsApp Analytics" onRefresh={handleRefresh} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Messages Sent</CardTitle>
            <CardDescription className="text-2xl font-bold text-emerald-700">
              4,892
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-emerald-600">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-50 to-sky-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Message Open Rate</CardTitle>
            <CardDescription className="text-2xl font-bold text-blue-700">
              78.5%
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-blue-600">+5.2% from last month</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-violet-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Response Rate</CardTitle>
            <CardDescription className="text-2xl font-bold text-purple-700">
              42.3%
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-purple-600">+3.7% from last month</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" className="mb-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="response">Response Time</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Message Performance</CardTitle>
              <CardDescription>
                Track sent, delivered, and read messages over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={mockWhatsAppData.messageStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="sent" stroke="#8884d8" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="delivered" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="read" stroke="#ffc658" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="campaigns" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
              <CardDescription>
                Compare performance metrics across different campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={mockWhatsAppData.campaignPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sent" fill="#8884d8" />
                  <Bar dataKey="responses" fill="#82ca9d" />
                  <Bar dataKey="conversion" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="response" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Average Response Time</CardTitle>
              <CardDescription>
                Track average response time throughout the day (in minutes)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={mockWhatsAppData.responseTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="avgResponseTime" stroke="#82ca9d" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WhatsAppPage;
