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
