import { TabsContent } from '@/components/ui/tabs';
import { ReportGenerationForm } from '@/components/ReportGenerationForm';

interface GenerateTabProps {
  onReportGenerated?: () => void;
}

export function GenerateTab({ onReportGenerated }: GenerateTabProps) {
  return (
    <TabsContent value="generate" className="space-y-4 animate-fade-in">
      <ReportGenerationForm onReportGenerated={onReportGenerated} />
    </TabsContent>
  );
}
