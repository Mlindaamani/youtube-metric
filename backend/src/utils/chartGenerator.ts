import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import type { AnalyticsData } from '@/modules/youtube/youtube.types.ts';

const canvas = new ChartJSNodeCanvas({ width: 800, height: 450 });

export const generateCharts = async (data: AnalyticsData): Promise<Buffer[]> => {
  const charts: Buffer[] = [];

  // Retention Curve
  charts.push(
    await canvas.renderToBuffer({
      type: 'line',
      data: {
        labels: ['0%', '20%', '40%', '60%', '80%', '100%'],
        datasets: [{
          label: 'Retention',
          data: data.retentionCurve,
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99,102,241,0.1)',
          fill: true,
          tension: 0.4,
        }],
      },
      options: { plugins: { legend: { display: false } } },
    })
  );

  // Age Groups Doughnut
  charts.push(
    await canvas.renderToBuffer({
      type: 'doughnut',
      data: {
        labels: Object.keys(data.ageGroups),
        datasets: [{ data: Object.values(data.ageGroups), backgroundColor: ['#8b5cf6','#3b82f6','#10b981'] }],
      },
    })
  );

  return charts;
};