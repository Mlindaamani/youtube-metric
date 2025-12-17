import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { Navbar } from '@/components/Navbar';
import { ChannelCard } from '@/components/ChannelCard';
import { ReportGenerationForm } from '@/components/ReportGenerationForm';
import { ReportsTable } from '@/components/ReportsTable';
import { Radio } from 'lucide-react';

export default function Dashboard() {
  const { isAuthenticated, isLoading, channel, reports, checkAuth, fetchChannel, fetchReports } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // COMMENTED OUT: Auth redirect for now
  // useEffect(() => {
  //   if (!isLoading && !isAuthenticated) {
  //     navigate('/login');
  //   }
  // }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchChannel();
      fetchReports();
    }
  }, [isAuthenticated, fetchChannel, fetchReports]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <Radio className="h-12 w-12 text-primary" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // COMMENTED OUT: Auth check for now
  // if (!isAuthenticated) {
  //   return null;
  // }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Futuristic background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,238,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,238,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand/5 rounded-full blur-[120px]" />
      
      <div className="relative z-10">
        <Navbar />
        
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Page header */}
            <div className="animate-fade-in">
              <h1 className="text-3xl font-bold text-foreground">
                <span className="text-brand">Dashboard</span>
              </h1>
              <p className="text-muted-foreground mt-1">Monitor your podcast performance and generate reports</p>
            </div>

            {/* Channel Overview */}
            {channel ? (
              <ChannelCard channel={channel} />
            ) : (
              <div className="animate-pulse bg-card/50 backdrop-blur-sm rounded-2xl h-48 border border-brand/20" />
            )}

            {/* Report Generation & History */}
            <div className="grid gap-6 lg:grid-cols-2">
              <ReportGenerationForm />
              <div className="lg:col-span-2">
                <ReportsTable reports={reports} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
