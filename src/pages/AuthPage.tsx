
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/sonner';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();

  // Check if user is already logged in
  useEffect(() => {
    // Prevent redirection during the initial auth loading phase
    if (authLoading) {
      return;
    }
    
    // Only redirect if we have a user and we're not already redirecting
    if (user && !redirecting) {
      setRedirecting(true);
      
      // Add a small delay to prevent rapid redirections
      const redirectTimer = setTimeout(() => {
        navigate('/', { replace: true });
      }, 100);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [user, authLoading, navigate, redirecting]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        setAuthError(error.message);
        toast.error(error.message);
      } else {
        toast.success('Sign up successful! Please check your email for verification.');
        setEmail('');
        setPassword('');
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        setAuthError(error.message);
        toast.error(error.message);
      } else {
        toast.success('Signed in successfully!');
        // No need to navigate here, the useEffect will handle it
      }
    } catch (error) {
      console.error('Signin error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Don't render the auth form if we're redirecting
  if (redirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Redirecting to dashboard...</span>
      </div>
    );
  }

  // Only render the auth form if not logged in and not redirecting
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 w-full p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Merge Insights AI</CardTitle>
          <CardDescription>Sign in or create an account</CardDescription>
        </CardHeader>
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <form onSubmit={handleSignIn}>
              <CardContent className="space-y-4 pt-4">
                {authError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                    {authError}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input 
                    id="signin-email"
                    type="email" 
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input 
                    id="signin-password"
                    type="password" 
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing In...
                    </>
                  ) : 'Sign In'}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="signup">
            <form onSubmit={handleSignUp}>
              <CardContent className="space-y-4 pt-4">
                {authError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                    {authError}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input 
                    id="signup-email"
                    type="email" 
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input 
                    id="signup-password"
                    type="password" 
                    placeholder="Password (min 6 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  By signing up, you agree to our Terms of Service and Privacy Policy.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing Up...
                    </>
                  ) : 'Sign Up'}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default AuthPage;
