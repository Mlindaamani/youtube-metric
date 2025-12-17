import { create } from 'zustand';
import { authApi, channelApi, reportApi } from '@/lib/api';

export interface ChannelStats {
  totalViews: number;
  subscribers: number;
  videoCount: number;
}

export interface Channel {
  id: string;
  title: string;
  customName: string;
  thumbnailUrl: string;
  stats: ChannelStats;
}

export interface Report {
  id: string;
  title: string;
  period: string;
  generatedAt: string;
  type: 'manual' | 'scheduled';
  filename: string;
}

interface AppState {
  isAuthenticated: boolean;
  isLoading: boolean;
  channel: Channel | null;
  reports: Report[];
  isGeneratingReport: boolean;
  
  // Actions
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
  fetchChannel: () => Promise<void>;
  fetchReports: () => Promise<void>;
  updateCustomName: (name: string) => Promise<void>;
  generateReport: (params: { period: string; startDate?: string; endDate?: string }) => Promise<void>;
  scheduleReport: (params: { period: string; frequency: string }) => Promise<void>;
  setAuthenticated: (value: boolean) => void;
}

export const useStore = create<AppState>((set, get) => ({
  isAuthenticated: false,
  isLoading: true,
  channel: null,
  reports: [],
  isGeneratingReport: false,

  checkAuth: async () => {
    // MOCK: Check if user has logged out (don't auto-authenticate if logged out)
    const currentState = get();
    if (currentState.isLoading) {
      // First load - don't auto-authenticate, let user go to login
      set({ isAuthenticated: false, isLoading: false });
    }
  },

  logout: async () => {
    set({ isAuthenticated: false, isLoading: false, channel: null, reports: [] });
  },

  fetchChannel: async () => {
    // MOCK: Return demo channel data
    set({
      channel: {
        id: 'UC123456789',
        title: 'Thinker & Builder',
        customName: 'Thinker & Builder',
        thumbnailUrl: 'https://yt3.ggpht.com/ytc/AIdro_kVKPpQv4Z2EFNQFmRwb7gfXJVVGUqKHLVwA2ydZw=s800',
        stats: {
          totalViews: 1250000,
          subscribers: 45200,
          videoCount: 156
        }
      }
    });
  },

  fetchReports: async () => {
    // MOCK: Return demo reports
    set({
      reports: [
        {
          id: '1',
          title: 'Q4 2024 Performance Report',
          period: 'Oct 1 - Dec 31, 2024',
          generatedAt: '2024-12-10T14:30:00Z',
          type: 'manual',
          filename: 'thinker-builder-q4-2024.docx'
        },
        {
          id: '2',
          title: 'November 2024 Monthly Report',
          period: 'Nov 1 - Nov 30, 2024',
          generatedAt: '2024-12-01T09:00:00Z',
          type: 'scheduled',
          filename: 'thinker-builder-nov-2024.docx'
        },
        {
          id: '3',
          title: 'Full Channel History Report',
          period: 'Full History',
          generatedAt: '2024-11-15T16:45:00Z',
          type: 'manual',
          filename: 'thinker-builder-full-history.docx'
        }
      ]
    });
  },

  updateCustomName: async (customName: string) => {
    const channel = get().channel;
    if (channel) {
      set({ channel: { ...channel, customName } });
    }
  },

  generateReport: async (params) => {
    set({ isGeneratingReport: true });
    // MOCK: Simulate report generation delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    const newReport = {
      id: Date.now().toString(),
      title: `${params.period} Report`,
      period: params.startDate && params.endDate 
        ? `${params.startDate} - ${params.endDate}` 
        : params.period,
      generatedAt: new Date().toISOString(),
      type: 'manual' as const,
      filename: `thinker-builder-${Date.now()}.docx`
    };
    set(state => ({ 
      reports: [newReport, ...state.reports],
      isGeneratingReport: false 
    }));
  },

  scheduleReport: async (params) => {
    // MOCK: Simulate scheduling
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Scheduled report:', params);
  },

  setAuthenticated: (value: boolean) => set({ isAuthenticated: value }),
}));
