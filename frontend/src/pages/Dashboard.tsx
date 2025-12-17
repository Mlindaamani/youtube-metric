import { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Navbar } from '@/components/Navbar';
import { ChannelCard } from '@/components/ChannelCard';
import { ReportGenerationForm } from '@/components/ReportGenerationForm';
import { ReportsTable } from '@/components/ReportsTable';
import { JobsManager } from '@/components/JobsManager';

export default function Dashboard() {
  const { 
    auth, 
    channel, 
    reports, 
    fetchChannelInfo, 
    fetchReports 
  } = useStore();

  useEffect(() => {
    if (auth.isAuthenticated) {
      fetchChannelInfo();
      fetchReports();
    }
  }, [auth.isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

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
              <p className="text-muted-foreground mt-1">Monitor your YouTube channel performance and generate reports</p>
            </div>

            {/* Channel Overview */}
            {channel.current ? (
              <ChannelCard channel={channel.current} />
            ) : channel.loading ? (
              <div className="animate-pulse bg-card/50 backdrop-blur-sm rounded-2xl h-48 border border-brand/20" />
            ) : (
              <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-brand/20 text-center">
                <p className="text-muted-foreground">No channel connected</p>
              </div>
            )}

            {/* Report Generation & Jobs Management */}
            <div className="grid gap-6 lg:grid-cols-2">
              <ReportGenerationForm />
              <JobsManager />
            </div>

            {/* Reports History */}
            <div className="lg:col-span-2">
              <ReportsTable reports={reports.reports} />
            </div>

            {/* Jobs Management */}
            <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <JobsManager />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
