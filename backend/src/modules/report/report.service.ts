import Report from '@/modules/report/report.model.ts';
import Channel from '@/modules/channel/channel.model.ts';
import { getChannelAnalytics } from '@/modules/youtube/youtube.api.ts';
import { generateCharts } from '@/utils/chartGenerator.ts';
import { generateDocxReport } from '@/modules/report/report.generator.ts';
import { generateInsights } from '@/modules/report/insights.engine.ts';


export const generateReport = async (options: {
  period: string;
  generatedBy: "manual" | "scheduled";
}) => {
  const channel = await Channel.findOne();
  if (!channel) throw new Error("No channel linked!");

  const analytics = await getChannelAnalytics(
    channel.refreshToken,
    options.period
  );
  const charts = await generateCharts(analytics);
  const insights = generateInsights(analytics);
  const filePath = await generateDocxReport(
    channel.customName || channel.title,
    analytics,
    charts,
    insights
  );

  const report = new Report({
    channelId: channel.channelId,
    title: `Report – ${new Date().toLocaleString("default", {
      month: "long",
      year: "numeric",
    })}`,
    period: options.period,
    filePath,
    insights,
    generatedBy: options.generatedBy,
  });

  await report.save();
  return report;
};

export const getAllReports = async () =>
  Report.find().sort({ generatedAt: -1 });

export const deleteReport = async (reportId: string) => {
  const report = await Report.findById(reportId);
  
  if (!report) {
    throw new Error("Report not found");
  }

  // Delete the file from disk if it exists
  const fs = await import('fs');
  const path = await import('path');
  
  try {
    if (report.filePath && fs.existsSync(report.filePath)) {
      fs.unlinkSync(report.filePath);
      console.log('Report file deleted:', report.filePath);
    }
  } catch (error) {
    console.error('Error deleting report file:', error);
    // Continue with database deletion even if file deletion fails
  }

  // Delete the report document from database
  await Report.findByIdAndDelete(reportId);
  
  return { message: "Report deleted successfully" };
};
