import type { Request, Response } from "express";
import { jobService } from "./job.service.js";
import { catchAsync } from "@/middleware/errorHandler.ts";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    [key: string]: any;
  };
}

/**
 * Create a new scheduled job
 */
export const createScheduledJob = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.channelId || req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { name, frequency, period, parameters } = req.body;

    // Validation
    if (!name || !frequency || !period) {
      return res.status(400).json({
        message: "Missing required fields: name, frequency, period",
      });
    }

    if (!["daily", "weekly", "monthly"].includes(frequency)) {
      return res.status(400).json({
        message: "Invalid frequency. Must be daily, weekly, or monthly",
      });
    }

    const job = await jobService.createJob(userId, {
      name,
      frequency,
      period,
      parameters: parameters || {},
    });

    res.status(201).json({
      success: true,
      data: job,
      message: "Job scheduled successfully",
    });
  }
);

/**
 * Get all scheduled jobs for the authenticated user
 */
export const getUserJobs = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.channelId || req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const jobs = await jobService.getUserJobs(userId);

    res.status(200).json({
      success: true,
      data: jobs,
    });
  }
);

/**
 * Cancel/delete a scheduled job
 */
export const cancelJob = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.channelId || req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { jobId } = req.params;
    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required" });
    }

    await jobService.cancelJob(jobId, userId);

    res.status(200).json({
      success: true,
      message: "Job cancelled successfully",
    });
  }
);

/**
 * Update job status (activate/deactivate)
 */
export const updateJobStatus = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.channelId || req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { jobId } = req.params;
    const { isActive } = req.body;

    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required" });
    }

    if (typeof isActive !== "boolean") {
      return res.status(400).json({ message: "isActive must be a boolean" });
    }

    const updatedJob = await jobService.updateJobStatus(jobId, isActive);

    res.status(200).json({
      success: true,
      data: updatedJob,
      message: `Job ${isActive ? "activated" : "deactivated"} successfully`,
    });
  }
);

/**
 * Get job statistics
 */
export const getJobStats = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.channelId || req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const stats = await jobService.getJobStats(userId);

    res.status(200).json({
      success: true,
      data: stats,
    });
  }
);
