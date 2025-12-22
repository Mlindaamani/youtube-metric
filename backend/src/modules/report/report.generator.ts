import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  ImageRun,
} from "docx";
import { storageService } from '@/services/storageService.ts';
import type { AnalyticsData } from "@/modules/youtube/youtube.types.ts";

interface ReportGenerationResult {
  filePath: string;
  url?: string | undefined;
  publicId?: string | undefined;
  filename: string;
}

export const generateDocxReport = async (
  channelTitle: string,
  data: AnalyticsData,
  charts: Buffer[],
  insights: string[]
): Promise<ReportGenerationResult> => {
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: "YouTube Podcast Performance Report",
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: channelTitle,
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: `Generated: ${new Date().toLocaleDateString()}`,
            alignment: AlignmentType.CENTER,
          }),

          ...charts.map(
            (chart) =>
              new Paragraph({
                children: [
                  new ImageRun({
                    data: chart,
                    transformation: { width: 650, height: 366 },
                    type: "png",
                  }),
                ],
                alignment: AlignmentType.CENTER,
              })
          ),

          new Paragraph({
            text: "Key Insights",
            heading: HeadingLevel.HEADING_1,
          }),
          ...insights.map(
            (i) => new Paragraph({ children: [new TextRun(`• ${i}`)] })
          ),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const filename = `Report_${channelTitle.replace(
    /\s+/g,
    "_"
  )}_${Date.now()}.docx`;
  
  // Use storage service instead of direct file system operations
  const storageResult = await storageService.storeDocument(buffer, filename);
  
  return {
    filePath: storageResult.filePath,
    url: storageResult.url,
    publicId: storageResult.publicId,
    filename,
  };
};
