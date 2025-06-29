
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface IntegrationCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  urlLabel: string;
  urlPlaceholder: string;
  url: string;
  onUrlChange: (value: string) => void;
  onConnect: () => void;
  isConnecting: boolean;
  buttonText: string;
  buttonIcon: React.ReactNode;
  features: string[];
  variant?: 'primary' | 'outline';
}

const IntegrationCard = ({
  icon,
  title,
  description,
  urlLabel,
  urlPlaceholder,
  url,
  onUrlChange,
  onConnect,
  isConnecting,
  buttonText,
  buttonIcon,
  features,
  variant = 'primary'
}: IntegrationCardProps) => {
  return (
    <Card className="border-2 hover:border-green-200 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            {icon}
          </div>
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`${title.toLowerCase()}-url`} className="text-sm font-medium">{urlLabel}</Label>
          <Input
            id={`${title.toLowerCase()}-url`}
            placeholder={urlPlaceholder}
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            className="h-10"
          />
        </div>
        <Button 
          onClick={onConnect}
          disabled={isConnecting}
          variant={variant === 'outline' ? 'outline' : 'default'}
          className={`w-full h-10 ${variant === 'primary' ? 'bg-green-600 hover:bg-green-700' : 'border-green-200 hover:bg-green-50'}`}
        >
          {isConnecting ? (
            <>
              <div className={`w-4 h-4 border-2 ${variant === 'primary' ? 'border-white' : 'border-green-600'} border-t-transparent rounded-full animate-spin mr-2`} />
              Connecting...
            </>
          ) : (
            <>
              {buttonIcon}
              {buttonText}
            </>
          )}
        </Button>
        <div className="text-xs text-muted-foreground bg-gray-50 p-2 rounded">
          {features.map((feature, index) => (
            <p key={index}>• {feature}</p>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default IntegrationCard;
