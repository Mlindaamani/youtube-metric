/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';
import { authAPI } from '../api/auth';
import { channelAPI } from '../api/channel';
import { reportsAPI } from '../api/reports';
import { jobAPI } from '../api/jobs';
import { AppState, User, ChannelInfo, Report, ReportGenerationRequest, Job, JobStats, CreateJobRequest } from '../types';

interface StoreState extends AppState {
  // Auth actions
  checkAuth: () => Promise<void>;
  loginWithGoogle: () => void;
  logout: () => Promise<void>;
  setAuthenticated: (value: boolean, user?: User | null) => void;

  // Channel actions
  fetchChannelInfo: () => Promise<void>;
  updateChannel: (channelId: string, updateData: any) => Promise<void>;
  setChannelLoading: (loading: boolean) => void;
  setChannelError: (error: string | null) => void;

  // Reports actions
  fetchReports: () => Promise<void>;
  generateReport: (params: ReportGenerationRequest) => Promise<void>;
  scheduleReport: (params: CreateJobRequest) => Promise<void>;
  downloadReport: (reportId: string, filename: string) => Promise<void>;
  deleteReport: (reportId: string) => Promise<void>;
  setReportsLoading: (loading: boolean) => void;
  setReportsError: (error: string | null) => void;
  setGenerating: (generating: boolean) => void;

  // Jobs actions
  fetchJobs: () => Promise<void>;
  createJob: (jobData: CreateJobRequest) => Promise<void>;
  cancelJob: (jobId: string) => Promise<void>;
  toggleJobStatus: (jobId: string, isActive: boolean) => Promise<void>;
  fetchJobStats: () => Promise<void>;
  setJobsLoading: (loading: boolean) => void;
  setJobsError: (error: string | null) => void;
  setCreating: (creating: boolean) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Initial state
      auth: {
        isAuthenticated: false,
        user: null,
        loading: false,
      },
      channel: {
        current: null,
        loading: false,
        error: null,
      },
      reports: {
        reports: [],
        loading: false,
        error: null,
        generating: false,
      },
      jobs: {
        jobs: [],
        stats: null,
        loading: false,
        error: null,
        creating: false,
        statsLastFetched: undefined,
      },

      // Auth actions
      checkAuth: async () => {
        // Prevent duplicate calls if already loading
        const currentState = get();
        if (currentState.auth.loading) {
          return;
        }
        
        try {
          set(state => ({ auth: { ...state.auth, loading: true } }));
          const authStatus = await authAPI.getStatus();

          set(state => ({ 
            auth: { 
              ...state.auth, 
              isAuthenticated: authStatus.isAuthenticated,
              user: authStatus.user,
              loading: false 
            } 
          }));
        } catch (error: any) {
          console.error('Auth check failed:', error);
          set(state => ({ 
            auth: { 
              ...state.auth, 
              isAuthenticated: false, 
              user: null, 
              loading: false 
            } 
          }));
        }
      },

      loginWithGoogle: () => {
        authAPI.loginWithGoogle();
      },

      logout: async () => {
        try {
          await authAPI.logout();
          set(state => ({
            auth: { 
              ...state.auth, 
              isAuthenticated: false, 
              user: null 
            },
            channel: {
              current: null,
              loading: false,
              error: null,
            },
            reports: {
              reports: [],
              loading: false,
              error: null,
              generating: false,
            },
            jobs: {
              jobs: [],
              stats: null,
              loading: false,
              error: null,
              creating: false,
              statsLastFetched: undefined,
            },
          }));
          toast.success('Logged out successfully');
        } catch (error: any) {
          toast.error('Logout failed');
          console.error('Logout error:', error);
        }
      },

      setAuthenticated: (value: boolean, user: User | null = null) => {
        set(state => ({ 
          auth: { 
            ...state.auth, 
            isAuthenticated: value, 
            user 
          } 
        }));
      },

      // Channel actions
      fetchChannelInfo: async () => {
        try {
          set(state => ({ channel: { ...state.channel, loading: true, error: null } }));
          const channelInfo = await channelAPI.getInfo();
          set(state => ({ 
            channel: { 
              ...state.channel, 
              current: channelInfo, 
              loading: false 
            } 
          }));
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Failed to fetch channel info';
          set(state => ({ 
            channel: { 
              ...state.channel, 
              loading: false, 
              error: errorMessage 
            } 
          }));
          if (error.response?.status !== 404) {
            toast.error(errorMessage);
          }
        }
      },

      updateChannel: async (channelId: string, updateData: any) => {
        try {
          const updatedChannel = await channelAPI.updateChannel(channelId, updateData);
          set(state => ({
            channel: {
              ...state.channel,
              current: state.channel.current ? {
                ...state.channel.current,
                ...updatedChannel
              } : null
            }
          }));
          toast.success('Channel updated successfully');
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Failed to update channel';
          toast.error(errorMessage);
          throw error;
        }
      },

      setChannelLoading: (loading: boolean) => {
        set(state => ({ channel: { ...state.channel, loading } }));
      },

      setChannelError: (error: string | null) => {
        set(state => ({ channel: { ...state.channel, error } }));
      },

      // Reports actions
      fetchReports: async () => {
        try {
          set(state => ({ reports: { ...state.reports, loading: true, error: null } }));
          const reports = await reportsAPI.getAll();
          set(state => ({ 
            reports: { 
              ...state.reports, 
              reports, 
              loading: false 
            } 
          }));
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Failed to fetch reports';
          set(state => ({ 
            reports: { 
              ...state.reports, 
              loading: false, 
              error: errorMessage 
            } 
          }));
          toast.error(errorMessage);
        }
      },

      generateReport: async (params: ReportGenerationRequest) => {
        try {
          set(state => ({ reports: { ...state.reports, generating: true, error: null } }));
          const newReport = await reportsAPI.generate(params);
          set(state => ({
            reports: {
              ...state.reports,
              reports: [newReport, ...state.reports.reports],
              generating: false
            }
          }));
          toast.success('Report generated successfully!');
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Failed to generate report';
          set(state => ({ 
            reports: { 
              ...state.reports, 
              generating: false, 
              error: errorMessage 
            } 
          }));
          toast.error(errorMessage);
          throw error;
        }
      },

      scheduleReport: async (params: CreateJobRequest) => {
        try {
          set(state => ({ jobs: { ...state.jobs, creating: true, error: null } }));
          const newJob = await jobAPI.create(params);
          set(state => ({
            jobs: {
              ...state.jobs,
              jobs: [newJob, ...state.jobs.jobs],
              creating: false
            }
          }));
          toast.success(`Report scheduled to run ${params.frequency}!`);
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Failed to schedule report';
          set(state => ({ 
            jobs: { 
              ...state.jobs, 
              creating: false, 
              error: errorMessage 
            } 
          }));
          toast.error(errorMessage);
          throw error;
        }
      },

      downloadReport: async (reportId: string, filename: string) => {
        try {
          const blob = await reportsAPI.download(reportId);
          
          // Create download link
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          
          toast.success('Report downloaded successfully!');
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Failed to download report';
          toast.error(errorMessage);
        }
      },

      deleteReport: async (reportId: string) => {
        try {
          await reportsAPI.delete(reportId);
          set(state => ({
            reports: {
              ...state.reports,
              reports: state.reports.reports.filter(report => report._id !== reportId)
            }
          }));
          toast.success('Report deleted successfully');
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Failed to delete report';
          toast.error(errorMessage);
        }
      },

      setReportsLoading: (loading: boolean) => {
        set(state => ({ reports: { ...state.reports, loading } }));
      },

      setReportsError: (error: string | null) => {
        set(state => ({ reports: { ...state.reports, error } }));
      },

      setGenerating: (generating: boolean) => {
        set(state => ({ reports: { ...state.reports, generating } }));
      },

      // Jobs actions
      fetchJobs: async () => {
        // Prevent duplicate calls if already loading
        const currentState = get();
        if (currentState.jobs.loading) {
          return;
        }
        
        try {
          set(state => ({ jobs: { ...state.jobs, loading: true, error: null } }));
          const jobs = await jobAPI.getAll();
          set(state => ({ 
            jobs: { 
              ...state.jobs, 
              jobs, 
              loading: false 
            } 
          }));
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Failed to fetch jobs';
          set(state => ({ 
            jobs: { 
              ...state.jobs, 
              loading: false, 
              error: errorMessage 
            } 
          }));
          toast.error(errorMessage);
        }
      },

      createJob: async (jobData: CreateJobRequest) => {
        try {
          set(state => ({ jobs: { ...state.jobs, creating: true, error: null } }));
          const newJob = await jobAPI.create(jobData);
          set(state => ({
            jobs: {
              ...state.jobs,
              jobs: [newJob, ...state.jobs.jobs],
              creating: false
            }
          }));
          toast.success('Job created successfully!');
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Failed to create job';
          set(state => ({ 
            jobs: { 
              ...state.jobs, 
              creating: false, 
              error: errorMessage 
            } 
          }));
          toast.error(errorMessage);
          throw error;
        }
      },

      cancelJob: async (jobId: string) => {
        try {
          await jobAPI.cancel(jobId);
          set(state => ({
            jobs: {
              ...state.jobs,
              jobs: state.jobs.jobs.filter(job => job._id !== jobId)
            }
          }));
          toast.success('Job cancelled successfully');
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Failed to cancel job';
          toast.error(errorMessage);
        }
      },

      toggleJobStatus: async (jobId: string, isActive: boolean) => {
        try {
          const updatedJob = await jobAPI.updateStatus(jobId, isActive);
          set(state => ({
            jobs: {
              ...state.jobs,
              jobs: state.jobs.jobs.map(job =>
                job._id === jobId ? updatedJob : job
              )
            }
          }));
          toast.success(`Job ${isActive ? 'activated' : 'deactivated'} successfully`);
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Failed to update job status';
          toast.error(errorMessage);
        }
      },

      fetchJobStats: async () => {
        // Only fetch if we don't have recent stats (cache for 30 seconds)
        const currentState = get();
        const lastStatsTime = currentState.jobs.statsLastFetched;
        const now = Date.now();
        if (lastStatsTime && (now - lastStatsTime) < 30000) {
          return;
        }
        
        try {
          const stats = await jobAPI.getStats();
          set(state => ({ 
            jobs: { 
              ...state.jobs, 
              stats,
              statsLastFetched: now
            } 
          }));
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Failed to fetch job statistics';
          console.error('Job stats error:', errorMessage);
        }
      },

      setJobsLoading: (loading: boolean) => {
        set(state => ({ jobs: { ...state.jobs, loading } }));
      },

      setJobsError: (error: string | null) => {
        set(state => ({ jobs: { ...state.jobs, error } }));
      },

      setCreating: (creating: boolean) => {
        set(state => ({ jobs: { ...state.jobs, creating } }));
      },
    }),
    {
      name: 'yt-metrics-store',
      partialize: (state) => ({
        auth: {
          isAuthenticated: state.auth.isAuthenticated,
          user: state.auth.user,
          loading: false, // Don't persist loading state
        },
      }),
    }
  )
);
