import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useStore } from '@/store/useStore';
import { authApi } from '@/lib/api';
import { Radio, BarChart3, FileText, Zap, Loader2 } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

const features = [
  { icon: BarChart3, title: 'Analytics Dashboard', description: 'View real-time channel statistics' },
  { icon: FileText, title: 'Professional Reports', description: 'Generate detailed DOCX reports' },
  { icon: Zap, title: 'Instant Insights', description: 'Get actionable performance data' },
];

export default function LoginPage() {
  const { isAuthenticated, isLoading, checkAuth } = useStore();
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleLogin = () => {
    setIsRedirecting(true);
    window.location.href = authApi.getGoogleAuthUrl();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse">
          <Radio className="h-12 w-12 text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full gradient-hero blur-3xl opacity-50" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full gradient-hero blur-3xl opacity-30" />
      </div>

      <div className="relative z-10 w-full max-w-md space-y-8 animate-fade-in">
        {/* Logo and branding */}
        <div className="text-center">
          <div className="inline-flex p-4 rounded-2xl gradient-primary shadow-elevated pulse-glow mb-6">
            <Radio className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-foreground tracking-tight">Thinker<span className="text-brand">&</span>Builder</h1>
          <p className="mt-2 text-muted-foreground">YouTube Podcast Performance Analytics</p>
        </div>

        {/* Login card */}
        <Card className="shadow-elevated border-border/50">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl">Welcome back</CardTitle>
            <CardDescription>Sign in to access your podcast analytics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button 
              variant="google" 
              size="lg" 
              className="w-full" 
              onClick={handleLogin}
              disabled={isRedirecting}
            >
              {isRedirecting ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Redirecting to Google...
                </>
              ) : (
                <>
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </>
              )}
            </Button>
            
            <p className="text-center text-xs text-muted-foreground">
              By signing in, you authorize access to your YouTube Analytics data
            </p>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 pt-4">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="text-center animate-slide-up"
              style={{ animationDelay: `${0.2 + index * 0.1}s` }}
            >
              <div className="inline-flex p-3 rounded-xl bg-brand/10 mb-2">
                <feature.icon className="h-5 w-5 text-brand" />
              </div>
              <p className="text-xs font-medium text-foreground">{feature.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
