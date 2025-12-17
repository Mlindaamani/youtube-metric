import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useJobsStore } from '@/store/jobsStore';
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
  const { jobs, loading, stats, fetchJobs, cancelJob, toggleJobStatus, fetchJobStats } = useJobsStore();
  const [localJobs, setLocalJobs] = useState<Job[]>([]);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (!hasInitialized) {
      fetchJobs();
      fetchJobStats();
      setHasInitialized(true);
    }
  }, [fetchJobStats, fetchJobs, hasInitialized]);

  useEffect(() => {
    // Ensure jobs is an array before setting
    if (Array.isArray(jobs)) {
      setLocalJobs(jobs);
    } else {
      setLocalJobs([]);
    }
  }, [jobs]);
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
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800';
      case 'weekly':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-800';
      case 'monthly':
        return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900 dark:text-purple-200 dark:border-purple-800';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 border-0 shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-white/50 dark:bg-white/10 backdrop-blur">
                <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-blue-600/70 dark:text-blue-400/70 font-medium">Total Jobs</p>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{stats.total}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 border-0 shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-white/50 dark:bg-white/10 backdrop-blur">
                <Play className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-green-600/70 dark:text-green-400/70 font-medium">Active</p>
                <p className="text-3xl font-bold text-green-900 dark:text-green-100">{stats.active}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 border-0 shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-white/50 dark:bg-white/10 backdrop-blur">
                <Pause className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-amber-600/70 dark:text-amber-400/70 font-medium">Inactive</p>
                <p className="text-3xl font-bold text-amber-900 dark:text-amber-100">{stats.inactive}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 border-0 shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-white/50 dark:bg-white/10 backdrop-blur">
                <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-purple-600/70 dark:text-purple-400/70 font-medium">This Month</p>
                <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">{stats.byFrequency?.monthly || 0}</p>
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
          {loading ? (
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
              {Array.isArray(localJobs) && localJobs.map((job) => (
                <div
                  key={job._id}
                  className={`p-4 rounded-lg border transition-all ${
                    job.isActive 
                      ? 'border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20' 
                      : 'border-gray-200 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-900/20'
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
                          disabled={loading}
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