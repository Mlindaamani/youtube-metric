import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useChannelStore } from '@/store/channelStore';
import { useReportsStore } from '@/store/reportsStore';
import { Navbar } from '@/components/Navbar';
import { ChannelCard } from '@/components/ChannelCard';
import { DashboardHeader } from '@/components/DashboardHeader';
import { DashboardTabs } from '@/components/DashboardTabs';

export default function Dashboard() {
  const { isAuthenticated } = useAuthStore();
  const { current: channel, fetchChannelInfo } = useChannelStore();
  const { reports, fetchReports } = useReportsStore();
  const [activeTab, setActiveTab] = useState('reports');

  useEffect(() => {
    if (isAuthenticated) {
      fetchChannelInfo();
      fetchReports();
    }
  }, [isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Futuristic background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,238,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,238,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand/5 rounded-full blur-[120px]" />
      
      <div className="relative z-10">
        <Navbar />
        
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Page header */}
            <DashboardHeader />

            {/* Channel Overview */}
            {channel ? (
              <ChannelCard channel={channel} />
            ) : (
              <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-brand/20 text-center">
                <p className="text-muted-foreground">No channel connected</p>
              </div>
            )}

            {/* Dashboard Tabs */}
            <DashboardTabs reports={reports} activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
        </main>
      </div>
    </div>
  );
}
