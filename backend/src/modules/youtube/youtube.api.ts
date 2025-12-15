import { google } from "googleapis";
import type { AnalyticsData } from "@/modules/youtube/youtube.types.ts";

const youtube = google.youtube("v3");
const analytics = google.youtubeAnalytics("v2");

export const getAuthClient = (refreshToken: string) => {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ refresh_token: refreshToken });
  return oauth2Client;
};

// Simplified – fetch channel-wide analytics (lifetime)
export const getChannelAnalytics = async (
  refreshToken: string,
  period: string = "lifetime"
): Promise<AnalyticsData> => {
  const auth = getAuthClient(refreshToken);

  // Example metrics – extend as needed
  const report = await analytics.reports.query({
    auth,
    ids: "channel==MINE",
    startDate: "2010-01-01",
    endDate: "2025-12-31",
    metrics:
      "views,estimatedMinutesWatched,likes,comments,subscribersGained,averageViewPercentage",
    dimensions: "ageGroup,gender,country,trafficSource,deviceType",
  });

  // Parse and aggregate – placeholder logic
  const rows = report.data.rows || [];

  // Return mock/real aggregated data (replace with real parsing)
  return {
    views: 12345,
    watchTime: 67890,
    likes: 1234,
    comments: 567,
    subscribersGained: 890,
    avgRetention: 55,
    retentionCurve: [100, 85, 70, 55, 40, 30],
    ageGroups: { "18-24": 40, "25-34": 35, "35-44": 25 },
    gender: { male: 60, female: 40 },
    topCountries: { Tanzania: 70, Kenya: 20, Uganda: 10 },
    trafficSources: { search: 50, suggested: 30, external: 20 },
    devices: { mobile: 75, desktop: 20, tablet: 5 },
  };
};
