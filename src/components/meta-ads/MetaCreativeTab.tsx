
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MetaCreativeTab = () => {
  const creativeData = [
    { 
      title: "Summer Collection Video", 
      type: "Video Ad", 
      ctr: "3.8%", 
      engagement: "High",
      thumbnail: "https://placehold.co/60x60/blue/white"
    },
    { 
      title: "Product Carousel", 
      type: "Carousel Ad", 
      ctr: "2.4%", 
      engagement: "Medium",
      thumbnail: "https://placehold.co/60x60/green/white" 
    },
    { 
      title: "Customer Testimonial", 
      type: "Image Ad", 
      ctr: "1.9%", 
      engagement: "Medium",
      thumbnail: "https://placehold.co/60x60/orange/white" 
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Creative Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {creativeData.map((ad, i) => (
            <div key={i} className="flex gap-4 items-center border-b pb-4">
              <div className="w-[60px] h-[60px] bg-gray-200 rounded overflow-hidden">
                <div className="w-full h-full bg-blue-200 flex items-center justify-center text-xs">Ad</div>
              </div>
              <div className="flex-1">
                <div className="font-medium">{ad.title}</div>
                <div className="text-sm text-muted-foreground">{ad.type}</div>
              </div>
              <div className="text-right">
                <div className="font-medium">{ad.ctr} CTR</div>
                <div className="text-sm text-muted-foreground">{ad.engagement} Engagement</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MetaCreativeTab;
