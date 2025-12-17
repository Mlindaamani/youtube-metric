import cron from "node-cron";
import { Job, type IJob } from "./job.model.js";
import { generateReport } from "@/modules/report/report.service.ts";

class JobService {
  private scheduledJobs: Map<string, cron.ScheduledTask> = new Map();

  /**
   * Create a new scheduled job
   */
  async createJob(
    userId: string,
    jobData: {
      name: string;
      frequency: "daily" | "weekly" | "monthly";
      period: string;
      parameters: any;
    }
  ): Promise<IJob> {
    try {
      // Generate cron expression based on frequency
      const cronExpression = this.generateCronExpression(jobData.frequency);

      // Calculate next run time
      const nextRun = this.calculateNextRun(cronExpression);

      const job = new Job({
        userId,
        name: jobData.name,
        frequency: jobData.frequency,
        period: jobData.period,
        parameters: jobData.parameters,
        cronExpression,
        nextRun,
      });

      const savedJob = await job.save();

      // Schedule the job
      await this.scheduleJob(savedJob);

      return savedJob;
    } catch (error) {
      console.error("Error creating job:", error);
      throw new Error("Failed to create scheduled job");
    }
  }

  /**
   * Get all jobs for a user
   */
  async getUserJobs(userId: string): Promise<IJob[]> {
    try {
      return await Job.find({ userId }).sort({ createdAt: -1 });
    } catch (error) {
      console.error("Error fetching user jobs:", error);
      throw new Error("Failed to fetch jobs");
    }
  }

  /**
   * Cancel/delete a scheduled job
   */
  async cancelJob(jobId: string, userId: string): Promise<void> {
    try {
      const job = await Job.findOne({ _id: jobId, userId });
      if (!job) {
        throw new Error("Job not found");
      }

      // Remove from cron scheduler
      if (this.scheduledJobs.has(jobId)) {
        this.scheduledJobs.get(jobId)?.destroy();
        this.scheduledJobs.delete(jobId);
      }

      // Delete from database
      await Job.deleteOne({ _id: jobId });
    } catch (error) {
      console.error("Error canceling job:", error);
      throw new Error("Failed to cancel job");
    }
  }

  /**
   * Update job status
   */
  async updateJobStatus(
    jobId: string,
    isActive: boolean
  ): Promise<IJob | null> {
    try {
      const job = await Job.findByIdAndUpdate(
        jobId,
        { isActive },
        { new: true }
      );

      if (!job) {
        throw new Error("Job not found");
      }

      if (isActive) {
        await this.scheduleJob(job);
      } else {
        // Remove from scheduler if deactivating
        if (this.scheduledJobs.has(jobId)) {
          this.scheduledJobs.get(jobId)?.destroy();
          this.scheduledJobs.delete(jobId);
        }
      }

      return job;
    } catch (error) {
      console.error("Error updating job status:", error);
      throw new Error("Failed to update job status");
    }
  }

  /**
   * Initialize and load all active jobs on server start
   */
  async initializeJobs(): Promise<void> {
    try {
      const activeJobs = await Job.find({ isActive: true });
      for (const job of activeJobs) {
        await this.scheduleJob(job);
      }

    } catch (error) {
      console.error("Error initializing jobs:", error);
    }
  }

  /**
   * Schedule a job with node-cron
   */
  private async scheduleJob(job: IJob): Promise<void> {
    try {
      const task = cron.schedule(
        job.cronExpression,
        async () => {
          await this.executeJob(job);
        },
        {
          timezone: "UTC",
        }
      );

      // Start the task
      task.start();

      // Store reference for later management
      this.scheduledJobs.set(job._id.toString(), task);

    } catch (error) {
      console.error(`Error scheduling job ${job._id}:`, error);
    }
  }

  /**
   * Execute a job
   */
  private async executeJob(job: IJob): Promise<void> {
    try {
      console.log(`Executing job: ${job.name} for user: ${job.userId}`);

      // Update run count and last run
      await Job.updateOne(
        { _id: job._id },
        {
          $inc: { runCount: 1 },
          lastRun: new Date(),
          nextRun: this.calculateNextRun(job.cronExpression),
        }
      );

      // Execute the job based on type
      switch (job.type) {
        case "report_generation":
          await this.executeReportGeneration(job);
          break;
        default:
          console.warn(`Unknown job type: ${job.type}`);
      }
    } catch (error) {
      console.error(`Error executing job ${job._id}:`, error);
    }
  }

  /**
   * Execute report generation job
   */
  private async executeReportGeneration(job: IJob): Promise<void> {
    try {
      const reportParams = {
        period: job.parameters.period,
        generatedBy: "scheduled" as const,
      };

      // Generate the report
      const report = await generateReport(reportParams);
      console.log(
        `Report generated successfully for job: ${job.name} - Report ID: ${report._id}`
      );
    } catch (error) {
      console.error(`Error generating report for job ${job._id}:`, error);
    }
  }

  /**
   * Generate cron expression based on frequency
   */
  private generateCronExpression(frequency: string): string {
    switch (frequency) {
      case "daily":
        return "0 9 * * *"; // Every day at 9 AM
      case "weekly":
        return "0 9 * * 1"; // Every Monday at 9 AM
      case "monthly":
        return "0 9 1 * *"; // 1st of every month at 9 AM
      default:
        throw new Error(`Unsupported frequency: ${frequency}`);
    }
  }

  /**
   * Calculate next run time based on cron expression
   */
  private calculateNextRun(cronExpression: string): Date {
    // This is a simplified calculation - in production you might want to use a more robust library
    const now = new Date();
    const nextRun = new Date(now);

    if (cronExpression === "0 9 * * *") {
      // Daily
      nextRun.setDate(nextRun.getDate() + 1);
      nextRun.setHours(9, 0, 0, 0);
    } else if (cronExpression === "0 9 * * 1") {
      // Weekly
      const daysUntilMonday = (8 - nextRun.getDay()) % 7 || 7;
      nextRun.setDate(nextRun.getDate() + daysUntilMonday);
      nextRun.setHours(9, 0, 0, 0);
    } else if (cronExpression === "0 9 1 * *") {
      // Monthly
      nextRun.setMonth(nextRun.getMonth() + 1, 1);
      nextRun.setHours(9, 0, 0, 0);
    }

    return nextRun;
  }

  /**
   * Get job statistics
   */
  async getJobStats(userId: string): Promise<{
    total: number;
    active: number;
    inactive: number;
    byFrequency: Record<string, number>;
  }> {
    try {
      const jobs = await Job.find({ userId });

      return {
        total: jobs.length,
        active: jobs.filter((job) => job.isActive).length,
        inactive: jobs.filter((job) => !job.isActive).length,
        byFrequency: jobs.reduce((acc, job) => {
          acc[job.frequency] = (acc[job.frequency] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
      };
    } catch (error) {
      console.error("Error fetching job stats:", error);
      throw new Error("Failed to fetch job statistics");
    }
  }
}

export const jobService = new JobService();
