import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useStore } from '@/store/useStore';
import { Job } from '@/types';
import { 
  Calendar, 
  Clock, 
  Play, 
  Pause, 
  Trash2, 
  TrendingUp,
  Activity,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';

export function JobsManager() {
  const { jobs, fetchJobs, cancelJob, toggleJobStatus, fetchJobStats } = useStore();
  const [localJobs, setLocalJobs] = useState<Job[]>([]);

  useEffect(() => {
    fetchJobs();
    fetchJobStats();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setLocalJobs(jobs.jobs);
  }, [jobs.jobs]);

  const handleToggleStatus = async (jobId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    
    // Optimistically update the local state
    setLocalJobs(prev => 
      prev.map(job => 
        job._id === jobId ? { ...job, isActive: newStatus } : job
      )
    );

    try {
      await toggleJobStatus(jobId, newStatus);
    } catch (error) {
      // Revert on error
      setLocalJobs(prev => 
        prev.map(job => 
          job._id === jobId ? { ...job, isActive: currentStatus } : job
        )
      );
    }
  };

  const handleCancelJob = async (jobId: string) => {
    if (window.confirm('Are you sure you want to cancel this scheduled job?')) {
      try {
        await cancelJob(jobId);
        toast.success('Job cancelled successfully');
      } catch (error) {
        toast.error('Failed to cancel job');
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getFrequencyIcon = (frequency: string) => {
    switch (frequency) {
      case 'daily':
        return <Calendar className="h-4 w-4" />;
      case 'weekly':
        return <Clock className="h-4 w-4" />;
      case 'monthly':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'daily':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'weekly':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'monthly':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      {jobs.stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Settings className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Jobs</p>
                <p className="text-2xl font-bold">{jobs.stats.total}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <Play className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{jobs.stats.active}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gray-100">
                <Pause className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Inactive</p>
                <p className="text-2xl font-bold">{jobs.stats.inactive}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">{jobs.stats.byFrequency.monthly || 0}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Jobs List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Scheduled Jobs
          </CardTitle>
          <CardDescription>
            Manage your automated report generation schedules
          </CardDescription>
        </CardHeader>
        <CardContent>
          {jobs.loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading jobs...</p>
            </div>
          ) : localJobs.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No scheduled jobs</h3>
              <p className="text-muted-foreground">Create a scheduled report to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {localJobs.map((job) => (
                <div
                  key={job._id}
                  className={`p-4 rounded-lg border transition-all ${
                    job.isActive 
                      ? 'border-green-200 bg-green-50/50' 
                      : 'border-gray-200 bg-gray-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-lg">{job.name}</h4>
                        <Badge 
                          variant="outline" 
                          className={`${getFrequencyColor(job.frequency)} text-xs`}
                        >
                          {getFrequencyIcon(job.frequency)}
                          {job.frequency}
                        </Badge>
                        <Badge variant={job.isActive ? "default" : "secondary"}>
                          {job.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>Period: {job.period}</p>
                        <p>Next run: {formatDate(job.nextRun)}</p>
                        {job.lastRun && (
                          <p>Last run: {formatDate(job.lastRun)}</p>
                        )}
                        <p>Total runs: {job.runCount}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium">
                          {job.isActive ? "Active" : "Inactive"}
                        </label>
                        <Switch
                          checked={job.isActive}
                          onCheckedChange={() => handleToggleStatus(job._id, job.isActive)}
                          disabled={jobs.loading}
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancelJob(job._id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}