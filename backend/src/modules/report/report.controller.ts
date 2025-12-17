import type { Request, Response } from "express";
import {
  generateReport,
  getAllReports,
  deleteReport as deleteReportService,
} from "@/modules/report/report.service.ts";
import Report from "@/modules/report/report.model.ts";

export const createReport = async (req: Request, res: Response) => {
  try {
    console.log("Report generation request:", req.body);

    const { period = "lifetime", generatedBy = "manual" } = req.body;

    const report = await generateReport({
      period,
      generatedBy,
    });

    res.json({
      success: true,
      message: "Report generated successfully",
      data: report,
    });
  } catch (err: any) {
    console.error("Report generation error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Failed to generate report",
    });
  }
};

export const listReports = async (req: Request, res: Response) => {
  const reports = await getAllReports();
  res.json(reports);
};

export const downloadReport = async (req: Request, res: Response) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    console.log("Attempting to download file:", report.filePath);

    // Check if file exists
    const fs = await import("fs");
    const path = await import("path");

    if (!fs.existsSync(report.filePath)) {
      console.error("File not found at path:", report.filePath);
      return res.status(404).json({ message: "Report file not found" });
    }

    // Read file and send as buffer instead of using res.download()
    try {
      const fileBuffer = fs.readFileSync(report.filePath);
      const filename = path.basename(report.filePath);

      // Set proper headers for file download
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`
      );
      res.setHeader("Content-Length", fileBuffer.length);

      // Send the file buffer
      res.send(fileBuffer);
      console.log("File sent successfully:", filename);
    } catch (fileError) {
      console.error("Error reading file:", fileError);
      return res.status(500).json({ message: "Error reading report file" });
    }
  } catch (error) {
    console.error("Download report error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteReport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Report ID is required",
      });
    }

    const result = await deleteReportService(id);

    res.json({
      success: true,
      message: "Report deleted successfully",
      data: result,
    });
  } catch (err: any) {
    console.error("Delete report error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Failed to delete report",
    });
  }
};
