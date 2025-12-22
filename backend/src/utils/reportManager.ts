import { storageService } from '@/services/storageService.ts';
import Report from '@/modules/report/report.model.ts';

/**
 * Utility functions for report management
 */

export class ReportManager {
  
  /**
   * Get report file info including download URL
   */
  static async getReportFileInfo(reportId: string) {
    const report = await Report.findById(reportId);
    if (!report) {
      throw new Error('Report not found');
    }

    return {
      id: report._id,
      filename: report.filename,
      filePath: report.filePath,
      url: report.url,
      publicId: report.publicId,
      title: report.title,
      generatedAt: report.generatedAt,
    };
  }

  /**
   * Check if report file exists
   */
  static async verifyReportFile(reportId: string): Promise<boolean> {
    try {
      const report = await Report.findById(reportId);
      if (!report) return false;

      // Try to retrieve the document to verify it exists
      await storageService.retrieveDocument(report.filePath, report.publicId || undefined);
      return true;
    } catch (error) {
      console.error('Report file verification failed:', error);
      return false;
    }
  }

  /**
   * Get storage statistics
   */
  static async getStorageStats() {
    const reports = await Report.find();
    
    return {
      totalReports: reports.length,
      storageType: process.env.NODE_ENV === 'production' ? 'cloudinary' : 'local',
      reportsByType: {
        manual: reports.filter(r => r.generatedBy === 'manual').length,
        scheduled: reports.filter(r => r.generatedBy === 'scheduled').length,
      },
      recentReports: reports
        .sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime())
        .slice(0, 5)
        .map(r => ({
          id: r._id,
          title: r.title,
          generatedAt: r.generatedAt,
          generatedBy: r.generatedBy,
        })),
    };
  }

  /**
   * Cleanup orphaned reports (reports without files)
   */
  static async cleanupOrphanedReports() {
    const reports = await Report.find();
    const orphanedReports = [];

    for (const report of reports) {
      const fileExists = await this.verifyReportFile(report._id.toString());
      if (!fileExists) {
        orphanedReports.push(report);
      }
    }

    if (orphanedReports.length > 0) {
      await Report.deleteMany({
        _id: { $in: orphanedReports.map(r => r._id) }
      });
      
      console.log(`Cleaned up ${orphanedReports.length} orphaned reports`);
    }

    return {
      cleaned: orphanedReports.length,
      remaining: reports.length - orphanedReports.length,
    };
  }

  /**
   * Get file size (for local files only)
   */
  static async getReportSize(reportId: string): Promise<number | null> {
    try {
      if (process.env.NODE_ENV !== 'development') {
        return null; // Size calculation not supported for Cloudinary
      }

      const report = await Report.findById(reportId);
      if (!report) return null;

      const fs = await import('fs');
      if (fs.existsSync(report.filePath)) {
        const stats = fs.statSync(report.filePath);
        return stats.size;
      }
      return null;
    } catch (error) {
      console.error('Error getting report size:', error);
      return null;
    }
  }
}