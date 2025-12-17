import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useStore } from '@/store/useStore';
import { ReportGenerationRequest } from '@/types';
import { FileText, Calendar, Loader2, Clock } from 'lucide-react';
import { toast } from 'sonner';

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

export function ReportGenerationForm() {
  const [period, setPeriod] = useState('last12months');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduleFrequency, setScheduleFrequency] = useState('weekly');
  
  const { reports, jobs, generateReport, scheduleReport } = useStore();

  const handleGenerate = async () => {
    try {
      const params: ReportGenerationRequest = { 
        period, 
        generatedBy: 'manual' as const
      };
      
      if (period === 'custom') {
        if (!startDate || !endDate) {
          toast.error('Please select both start and end dates');
          return;
        }
        params.startDate = startDate;
        params.endDate = endDate;
      }

      await generateReport(params);
      toast.success('Report generated successfully!');
    } catch {
      toast.error('Failed to generate report. Please try again.');
    }
  };

  const handleSchedule = async () => {
    try {
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
    } catch {
      toast.error('Failed to schedule report. Please try again.');
    }
  };

  return (
    <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-brand">
            <FileText className="h-5 w-5 text-brand-foreground" />
          </div>
          <div>
            <CardTitle>Generate Report</CardTitle>
            <CardDescription>Create a performance report for your YouTube channel</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-brand" />
            <Label htmlFor="schedule-toggle" className="font-medium cursor-pointer">
              Schedule automatic reports
            </Label>
          </div>
          <Switch
            id="schedule-toggle"
            checked={isScheduled}
            onCheckedChange={setIsScheduled}
            className="data-[state=checked]:bg-brand"
          />
        </div>

        {isScheduled && (
          <div className="space-y-2 animate-fade-in">
            <Label htmlFor="frequency">Frequency</Label>
            <Select value={scheduleFrequency} onValueChange={setScheduleFrequency}>
              <SelectTrigger id="frequency" className="border-brand/30 focus:ring-brand">
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

        <div className="space-y-2">
          <Label htmlFor="period">Report Period</Label>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger id="period">
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
          <div className="grid grid-cols-2 gap-4 animate-fade-in">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        )}

        {isScheduled ? (
          <Button 
            onClick={handleSchedule} 
            disabled={jobs.creating}
            className="w-full bg-brand hover:bg-brand/90 text-brand-foreground"
            size="lg"
          >
            {jobs.creating ? (
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
            disabled={reports.loading}
            className="w-full"
            size="lg"
          >
            {reports.loading ? (
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
  );
}
