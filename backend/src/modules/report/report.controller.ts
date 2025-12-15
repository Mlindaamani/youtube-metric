import type { Request, Response } from "express";
import { generateReport, getAllReports } from "@/modules/report/report.service.ts";
import Report from "@/modules/report/report.model.ts";

export const createReport = async (req: Request, res: Response) => {
  try {
    const report = await generateReport({
      period: "lifetime",
      generatedBy: "manual",
    });
    res.json({ message: "Report generated", report });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const listReports = async (req: Request, res: Response) => {
  const reports = await getAllReports();
  res.json(reports);
};

export const downloadReport = async (req: Request, res: Response) => {
  const report = await Report.findById(req.params.id);
  if (!report) return res.status(404).json({ message: "Not found" });
  res.download(report.filePath);
};
