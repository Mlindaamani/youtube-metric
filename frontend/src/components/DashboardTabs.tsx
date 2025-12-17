import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReportsTab } from '@/components/ReportsTab';
import { GenerateTab } from '@/components/GenerateTab';
import { SchedulesTab } from '@/components/SchedulesTab';
import { BarChart3, FileText, Clock } from 'lucide-react';
import { Report } from '@/types';

interface DashboardTabsProps {
  reports: Report[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function DashboardTabs({ reports, activeTab, onTabChange }: DashboardTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3 lg:w-[400px] bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-900 dark:to-slate-800 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-sm">
        <TabsTrigger value="reports" className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-brand data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all">
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">Reports</span>
        </TabsTrigger>
        <TabsTrigger value="generate" className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-brand data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all">
          <BarChart3 className="h-4 w-4" />
          <span className="hidden sm:inline">Generate</span>
        </TabsTrigger>
        <TabsTrigger value="schedules" className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-brand data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all">
          <Clock className="h-4 w-4" />
          <span className="hidden sm:inline">Schedules</span>
        </TabsTrigger>
      </TabsList>

      <ReportsTab reports={reports} />
      <GenerateTab onReportGenerated={() => onTabChange('reports')} />
      <SchedulesTab />
    </Tabs>
  );
}
