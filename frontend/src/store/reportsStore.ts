/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { toast } from 'sonner';
import { reportsAPI } from '../api/reports';
import { Report, ReportGenerationRequest } from '../types';

interface ReportsState {
  reports: Report[];
  loading: boolean;
  error: string | null;
  generating: boolean;
  lastFetchTime: number;
}

interface ReportsActions {
  fetchReports: () => Promise<void>;
  generateReport: (params: ReportGenerationRequest) => Promise<void>;
  downloadReport: (reportId: string, filename: string) => Promise<void>;
  deleteReport: (reportId: string) => Promise<void>;
  setReportsLoading: (loading: boolean) => void;
  setReportsError: (error: string | null) => void;
  setGenerating: (generating: boolean) => void;
  clearReports: () => void;
}

type ReportsStore = ReportsState & ReportsActions;

export const useReportsStore = create<ReportsStore>((set, get) => ({
  // Initial state
  reports: [],
  loading: false,
  error: null,
  generating: false,
  lastFetchTime: 0,

  // Actions
  fetchReports: async () => {
    const state = get();
    const now = Date.now();
    
    // Prevent duplicate calls within 10 seconds
    if (state.loading || (now - state.lastFetchTime) < 10000) {
      return;
    }
    
    try {
      set({ loading: true, error: null, lastFetchTime: now });
      const reports = await reportsAPI.getAll();
      set({ 
        reports, 
        loading: false,
        error: null
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch reports';
      set({ 
        loading: false, 
        error: errorMessage 
      });
      toast.error(errorMessage);
    }
  },

  generateReport: async (params: ReportGenerationRequest) => {
    try {
      set({ generating: true, error: null });
      const newReport = await reportsAPI.generate(params);
      const currentReports = get().reports;
      
      set({
        reports: [newReport, ...currentReports],
        generating: false,
        error: null
      });
      toast.success('Report generated successfully!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to generate report';
      set({ 
        generating: false, 
        error: errorMessage 
      });
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
      const currentReports = get().reports;
      
      set({
        reports: currentReports.filter(report => report._id !== reportId)
      });
      toast.success('Report deleted successfully');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete report';
      toast.error(errorMessage);
    }
  },

  setReportsLoading: (loading: boolean) => {
    set({ loading });
  },

  setReportsError: (error: string | null) => {
    set({ error });
  },

  setGenerating: (generating: boolean) => {
    set({ generating });
  },

  clearReports: () => {
    set({ 
      reports: [],
      loading: false,
      error: null,
      generating: false,
      lastFetchTime: 0
    });
  },
}));