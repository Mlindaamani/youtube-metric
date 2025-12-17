/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { toast } from 'sonner';
import { jobAPI } from '../api/jobs';
import { Job, JobStats, CreateJobRequest } from '../types';

interface JobsState {
  jobs: Job[];
  stats: JobStats | null;
  loading: boolean;
  error: string | null;
  creating: boolean;
  statsLastFetched: number;
  lastFetchTime: number;
}

interface JobsActions {
  fetchJobs: () => Promise<void>;
  createJob: (jobData: CreateJobRequest) => Promise<void>;
  scheduleReport: (params: CreateJobRequest) => Promise<void>;
  cancelJob: (jobId: string) => Promise<void>;
  toggleJobStatus: (jobId: string, isActive: boolean) => Promise<void>;
  fetchJobStats: () => Promise<void>;
  setJobsLoading: (loading: boolean) => void;
  setJobsError: (error: string | null) => void;
  setCreating: (creating: boolean) => void;
  clearJobs: () => void;
}

type JobsStore = JobsState & JobsActions;

export const useJobsStore = create<JobsStore>((set, get) => ({
  // Initial state
  jobs: [],
  stats: null,
  loading: false,
  error: null,
  creating: false,
  statsLastFetched: 0,
  lastFetchTime: 0,

  // Actions
  fetchJobs: async () => {
    const state = get();
    const now = Date.now();
    
    // Prevent duplicate calls within 15 seconds or if loading
    if (state.loading || (now - state.lastFetchTime) < 15000) {
      return;
    }
    
    try {
      set({ loading: true, error: null, lastFetchTime: now });
      const jobs = await jobAPI.getAll();
      set({ 
        jobs, 
        loading: false,
        error: null
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch jobs';
      set({ 
        loading: false, 
        error: errorMessage 
      });
      toast.error(errorMessage);
    }
  },

  createJob: async (jobData: CreateJobRequest) => {
    try {
      set({ creating: true, error: null });
      const newJob = await jobAPI.create(jobData);
      const currentJobs = get().jobs;
      
      set({
        jobs: [newJob, ...currentJobs],
        creating: false,
        error: null
      });
      toast.success('Job created successfully!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create job';
      set({ 
        creating: false, 
        error: errorMessage 
      });
      toast.error(errorMessage);
      throw error;
    }
  },

  scheduleReport: async (params: CreateJobRequest) => {
    try {
      set({ creating: true, error: null });
      const newJob = await jobAPI.create(params);
      const currentJobs = get().jobs;
      
      set({
        jobs: [newJob, ...currentJobs],
        creating: false,
        error: null
      });
      toast.success(`Report scheduled to run ${params.frequency}!`);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to schedule report';
      set({ 
        creating: false, 
        error: errorMessage 
      });
      toast.error(errorMessage);
      throw error;
    }
  },

  cancelJob: async (jobId: string) => {
    try {
      await jobAPI.cancel(jobId);
      const currentJobs = get().jobs;
      
      set({
        jobs: currentJobs.filter(job => job._id !== jobId)
      });
      toast.success('Job cancelled successfully');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to cancel job';
      toast.error(errorMessage);
    }
  },

  toggleJobStatus: async (jobId: string, isActive: boolean) => {
    try {
      const updatedJob = await jobAPI.updateStatus(jobId, isActive);
      const currentJobs = get().jobs;
      
      set({
        jobs: currentJobs.map(job =>
          job._id === jobId ? updatedJob : job
        )
      });
      toast.success(`Job ${isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update job status';
      toast.error(errorMessage);
    }
  },

  fetchJobStats: async () => {
    const state = get();
    const now = Date.now();
    
    // Cache stats for 30 seconds
    if (state.statsLastFetched && (now - state.statsLastFetched) < 30000) {
      return;
    }
    
    try {
      const stats = await jobAPI.getStats();
      set({ 
        stats,
        statsLastFetched: now
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch job statistics';
      console.error('Job stats error:', errorMessage);
    }
  },

  setJobsLoading: (loading: boolean) => {
    set({ loading });
  },

  setJobsError: (error: string | null) => {
    set({ error });
  },

  setCreating: (creating: boolean) => {
    set({ creating });
  },

  clearJobs: () => {
    set({ 
      jobs: [],
      stats: null,
      loading: false,
      error: null,
      creating: false,
      statsLastFetched: 0,
      lastFetchTime: 0
    });
  },
}));