
import mongoose from 'mongoose';
import { config } from '@/config/index.ts';
import app from '@/app.ts';
import { startWeeklyJob } from '@/jobs/weeklyReport.job.ts';
import { jobService } from '@/modules/job/job.service.ts';


mongoose.connect(config.mongoUri).then(async () => {
  console.log('MongoDB connected');
  
  // Initialize scheduled jobs
  await jobService.initializeJobs();
  
  startWeeklyJob();
  app.listen(config.port, () => {
    console.log(`Server running on http://localhost:${config.port}`);
  });
}).catch(err => {
  console.error('MongoDB connection error:', err);
});