import { TabsContent } from '@/components/ui/tabs';
import { JobsManager } from '@/components/JobsManager';

export function SchedulesTab() {
  return (
    <TabsContent value="schedules" className="space-y-4 animate-fade-in">
      <JobsManager />
    </TabsContent>
  );
}
