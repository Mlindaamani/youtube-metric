/* eslint-disable @typescript-eslint/no-explicit-any */
// API Response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  statusCode?: number;
}

// User & Auth types
export interface User {
  id: string;
  displayName: string;
  email: string;
  name: {
    givenName: string;
    familyName: string;
  };
  photos: Array<{
    value: string;
  }>;
  provider: 'google';
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

// Channel types
export interface Channel {
  _id: string;
  channelId: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  refreshToken: string;
  customName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChannelLiveStats {
  title: string;
  thumbnailUrl?: string;
  viewCount: string;
  subscriberCount: string;
  videoCount: string;
}

export interface ChannelInfo extends Channel {
  liveStats: ChannelLiveStats;
}

// YouTube Analytics types
export interface AnalyticsData {
  views: number;
  watchTime: number;
  likes: number;
  comments: number;
  subscribersGained: number;
  avgRetention: number;
  retentionCurve: number[];
  ageGroups: Record<string, number>;
  gender: Record<string, number>;
  topCountries: Record<string, number>;
  trafficSources: Record<string, number>;
  devices: Record<string, number>;
}

// Report types
export interface Report {
  _id: string;
  channelId: string;
  title: string;
  period: string;
  filePath: string;
  insights: string[];
  generatedBy: 'manual' | 'scheduled';
  generatedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReportGenerationRequest {
  period: string;
  generatedBy: 'manual' | 'scheduled';
  startDate?: string;
  endDate?: string;
}

// Job types
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

// Error types
export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
  stack?: string;
}

// Store types
export interface AppState {
  auth: AuthState;
  channel: ChannelState;
  reports: ReportsState;
  jobs: JobsState;
}

export interface ChannelState {
  current: ChannelInfo | null;
  loading: boolean;
  error: string | null;
}

export interface ReportsState {
  reports: Report[];
  loading: boolean;
  error: string | null;
  generating: boolean;
}

export interface JobsState {
  jobs: Job[];
  stats: JobStats | null;
  loading: boolean;
  error: string | null;
  creating: boolean;
  statsLastFetched?: number;
}