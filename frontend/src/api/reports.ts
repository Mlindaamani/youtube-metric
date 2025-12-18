import api from "./index";
import { Report, ReportGenerationRequest } from "../types";

export const reportsAPI = {
  // Get all reports
  getAll: async (): Promise<Report[]> => {
    const response = await api.get("/reports");
    // Backend returns reports directly, not wrapped
    return response.data || [];
  },

  // Generate a new report
  generate: async (reportData: ReportGenerationRequest): Promise<Report> => {
    const response = await api.post("/reports/generate", reportData);
    return response.data.data || response.data;
  },

  // Download report file
  download: async (reportId: string): Promise<Blob> => {
    const response = await api.get(`/reports/${reportId}/download`, {
      responseType: "blob",
    });
    return response.data || response.data;
  },

  // Delete a report
  delete: async (reportId: string): Promise<void> => {
    await api.delete(`/reports/${reportId}`);
  },
};
