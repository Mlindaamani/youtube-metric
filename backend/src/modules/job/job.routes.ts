import express from 'express';
import { authMiddleware } from '@/middleware/authMiddleware.ts';
import {
  createScheduledJob,
  getUserJobs,
  cancelJob,
  updateJobStatus,
  getJobStats
} from '@/modules/job/job.controller.ts';

const router = express.Router();

// All job routes require authentication
router.use(authMiddleware);

// Job management routes
router.post('/schedule', createScheduledJob);
router.get('/', getUserJobs);
router.delete('/:jobId', cancelJob);
router.patch('/:jobId/status', updateJobStatus);
router.get('/stats', getJobStats);

export { router as jobRoutes };