import { TabsContent } from '@/components/ui/tabs';
import { ReportGenerationForm } from '@/components/ReportGenerationForm';

export function GenerateTab() {
  return (
    <TabsContent value="generate" className="space-y-4 animate-fade-in">
      <ReportGenerationForm />
    </TabsContent>
  );
}
