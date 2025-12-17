import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useReportsStore } from '@/store/reportsStore';
import { useJobsStore } from '@/store/jobsStore';
import { ReportGenerationRequest } from '@/types';
import { FileText, Calendar, Loader2, Clock } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const periodOptions = [
  { value: 'full', label: 'Full History' },
  { value: 'last12months', label: 'Last 12 Months' },
  { value: 'lastyear', label: 'Last Year' },
  { value: 'custom', label: 'Custom Range' },
];

const scheduleOptions = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

interface ReportGenerationFormProps {
  onReportGenerated?: () => void;
}

export function ReportGenerationForm({ onReportGenerated }: ReportGenerationFormProps) {
  const [period, setPeriod] = useState('last12months');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduleFrequency, setScheduleFrequency] = useState('weekly');
  const [isLoadingDialogOpen, setIsLoadingDialogOpen] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  
  const { reports, loading: reportsLoading, generateReport } = useReportsStore();
  const { loading: jobsLoading, scheduleReport } = useJobsStore();

  const handleGenerate = async () => {
    try {
      setIsLoadingDialogOpen(true);
      setLoadingMessage('Generating your report...');
      
      const params: ReportGenerationRequest = { 
        period, 
        generatedBy: 'manual' as const
      };
      
      if (period === 'custom') {
        if (!startDate || !endDate) {
          toast.error('Please select both start and end dates');
          setIsLoadingDialogOpen(false);
          return;
        }
        params.startDate = startDate;
        params.endDate = endDate;
      }

      await generateReport(params);
      toast.success('Report generated successfully!');
      // Call the callback to navigate to reports tab
      onReportGenerated?.();
    } catch {
      toast.error('Failed to generate report. Please try again.');
    } finally {
      setIsLoadingDialogOpen(false);
    }
  };

  const handleSchedule = async () => {
    try {
      setIsLoadingDialogOpen(true);
      setLoadingMessage('Scheduling your report...');
      
      const jobParams = {
        name: `${scheduleFrequency.charAt(0).toUpperCase() + scheduleFrequency.slice(1)} Report - ${period}`,
        frequency: scheduleFrequency as 'daily' | 'weekly' | 'monthly',
        period,
        parameters: {
          period,
          metrics: ['views', 'subscribers', 'revenue'],
          reportType: 'comprehensive'
        }
      };

      await scheduleReport(jobParams);
      toast.success('Report scheduled successfully!');
    } catch {
      toast.error('Failed to schedule report. Please try again.');
    } finally {
      setIsLoadingDialogOpen(false);
    }
  };

  return (
    <>
      <Card className="animate-slide-up border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-card to-card/80 dark:from-slate-950 dark:to-slate-900/80" style={{ animationDelay: '0.1s' }}>
      <CardHeader className="bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-brand/5 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-brand/20 border-b border-blue-200/20 dark:border-blue-800/30">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl">Generate Report</CardTitle>
            <CardDescription>Create a performance report for your YouTube channel</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 pt-6">
        <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 border border-purple-200/30 dark:border-purple-800/30 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/50">
              <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <Label htmlFor="schedule-toggle" className="font-medium cursor-pointer text-foreground">
              Schedule automatic reports
            </Label>
          </div>
          <Switch
            id="schedule-toggle"
            checked={isScheduled}
            onCheckedChange={setIsScheduled}
            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-600 data-[state=checked]:to-blue-600"
          />
        </div>

        {isScheduled && (
          <div className="space-y-3 animate-fade-in p-4 rounded-xl bg-gradient-to-br from-purple-50 to-transparent dark:from-purple-950/20 dark:to-transparent border border-purple-200/30 dark:border-purple-800/30">
            <Label htmlFor="frequency" className="font-semibold">Frequency</Label>
            <Select value={scheduleFrequency} onValueChange={setScheduleFrequency}>
              <SelectTrigger id="frequency" className="border-purple-200 dark:border-purple-800 focus:ring-purple-500">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                {scheduleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-3 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-950/20 dark:to-transparent border border-blue-200/30 dark:border-blue-800/30">
          <Label htmlFor="period" className="font-semibold">Report Period</Label>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger id="period" className="border-blue-200 dark:border-blue-800 focus:ring-blue-500">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              {periodOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {period === 'custom' && (
          <div className="grid grid-cols-2 gap-4 animate-fade-in p-4 rounded-xl bg-gradient-to-br from-amber-50 to-transparent dark:from-amber-950/20 dark:to-transparent border border-amber-200/30 dark:border-amber-800/30">
            <div className="space-y-3">
              <Label htmlFor="startDate" className="font-semibold">Start Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-600 dark:text-amber-400" />
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="pl-10 border-amber-200 dark:border-amber-800 focus:ring-amber-500"
                />
              </div>
            </div>
            <div className="space-y-3">
              <Label htmlFor="endDate" className="font-semibold">End Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-600 dark:text-amber-400" />
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="pl-10 border-amber-200 dark:border-amber-800 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>
        )}

        {isScheduled ? (
          <Button 
            onClick={handleSchedule} 
            disabled={jobsLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-shadow"
            size="lg"
          >
            {jobsLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Scheduling Report...
              </>
            ) : (
              <>
                <Clock className="h-4 w-4" />
                Schedule {scheduleFrequency.charAt(0).toUpperCase() + scheduleFrequency.slice(1)} Report
              </>
            )}
          </Button>
        ) : (
          <Button 
            onClick={handleGenerate} 
            disabled={reportsLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-brand hover:from-blue-700 hover:to-brand/90 text-white shadow-lg hover:shadow-xl transition-shadow"
            size="lg"
          >
            {reportsLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating Report...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" />
                Generate Report Now
              </>
            )}
          </Button>
        )}
      </CardContent>
      </Card>

      {/* Loading Dialog */}
      <Dialog open={isLoadingDialogOpen} onOpenChange={setIsLoadingDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 animate-pulse">
                <Loader2 className="h-5 w-5 text-white animate-spin" />
              </div>
              <span>Processing</span>
            </DialogTitle>
            <DialogDescription>{loadingMessage}</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-blue-200 dark:border-blue-900" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 border-r-purple-600 animate-spin" />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Please wait while we {isScheduled ? 'schedule' : 'generate'} your report...
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
