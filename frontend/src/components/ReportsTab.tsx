import { TabsContent } from '@/components/ui/tabs';
import { ReportsTable } from '@/components/ReportsTable';
import { FileText } from 'lucide-react';
import { Report } from '@/types';

interface ReportsTabProps {
  reports: Report[];
}

export function ReportsTab({ reports }: ReportsTabProps) {
  return (
    <TabsContent value="reports" className="space-y-4 animate-fade-in">
      <div className="bg-gradient-to-br from-card to-card/80 dark:from-slate-950 dark:to-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-200/20 dark:border-blue-800/30 shadow-lg hover:shadow-xl transition-shadow">
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-brand via-purple-600 to-blue-600 bg-clip-text text-transparent mb-6 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-brand">
            <FileText className="h-5 w-5 text-white" />
          </div>
          Report History
        </h2>
        {reports.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 mb-4">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-lg">No reports generated yet</p>
            <p className="text-muted-foreground text-sm mt-2">Create your first report in the Generate tab</p>
          </div>
        ) : (
          <ReportsTable reports={reports} />
        )}
      </div>
    </TabsContent>
  );
}
