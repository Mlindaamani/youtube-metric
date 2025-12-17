import apiClient from './index';

export interface Job {
  _id: string;
  userId: string;
  name: string;
  type: 'report_generation';
  frequency: 'daily' | 'weekly' | 'monthly';
  period: string;
  parameters: {
    period: string;
    metrics?: string[];
    reportType?: string;
  };
  cronExpression: string;
  isActive: boolean;
  nextRun: string;
  lastRun?: string;
  runCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface JobStats {
  total: number;
  active: number;
  inactive: number;
  byFrequency: Record<string, number>;
}

export interface CreateJobRequest {
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  period: string;
  parameters?: {
    period: string;
    metrics?: string[];
    reportType?: string;
  };
}

export const jobAPI = {
  // Create a scheduled job
  create: async (jobData: CreateJobRequest): Promise<Job> => {
    const response = await apiClient.post('/jobs/schedule', jobData);
    return response.data;
  },

  // Get all jobs for the current user
  getAll: async (): Promise<Job[]> => {
    const response = await apiClient.get('/jobs');
    return response.data;
  },

  // Cancel/delete a job
  cancel: async (jobId: string): Promise<void> => {
    await apiClient.delete(`/jobs/${jobId}`);
  },

  // Update job status (activate/deactivate)
  updateStatus: async (jobId: string, isActive: boolean): Promise<Job> => {
    const response = await apiClient.patch(`/jobs/${jobId}/status`, { isActive });
    return response.data;
  },

  // Get job statistics
  getStats: async (): Promise<JobStats> => {
    const response = await apiClient.get('/jobs/stats');
    return response.data;
  }
};