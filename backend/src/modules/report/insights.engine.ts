import type { AnalyticsData } from "@/modules/youtube/youtube.types.ts";

export const generateInsights = (data: AnalyticsData): string[] => {
  const insights: string[] = [];

  if (data.avgRetention < 40)
    insights.push(
      "Early drop-off detected – strengthen hooks in first 30 seconds."
    );
  if (data.devices?.mobile && data.devices.mobile > 70)
    insights.push(
      "Most viewers on mobile – optimize thumbnails & titles for small screens."
    );
  if (data.views < 10000)
    insights.push(
      "Channel growing – keep consistent uploads to reach 10K views."
    );

  if (insights.length === 0)
    insights.push("Strong performance across metrics – keep it up!");

  return insights;
};
