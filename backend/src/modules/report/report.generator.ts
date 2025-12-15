import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  ImageRun,
} from "docx";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { AnalyticsData } from "@/modules/youtube/youtube.types.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateDocxReport = async (
  channelTitle: string,
  data: AnalyticsData,
  charts: Buffer[],
  insights: string[]
): Promise<string> => {
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
  const filePath = path.join(__dirname, "../../../reports", filename);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, buffer);

  return filePath;
};
