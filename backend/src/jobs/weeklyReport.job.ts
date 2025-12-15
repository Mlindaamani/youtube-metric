import cron from 'node-cron';
import { generateReport } from '@/modules/report/report.service.ts';

export const startWeeklyJob = () => {
  cron.schedule('0 9 * * 0', async () => { // Every Sunday 9 AM
    console.log('Generating weekly scheduled report...');
    try {
      await generateReport({ period: 'lifetime', generatedBy: 'scheduled' });
    } catch (err) {
      console.error('Scheduled report failed:', err);
    }
  });
};