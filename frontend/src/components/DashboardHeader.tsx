import { Radio } from 'lucide-react';

export function DashboardHeader() {
  return (
    <div className="animate-fade-in mb-8">
      <div className="rounded-2xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-brand/10 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-brand/20 border border-blue-200/20 dark:border-blue-800/30 p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-brand to-purple-600 shadow-lg">
            <Radio className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-brand via-purple-600 to-blue-600 bg-clip-text text-transparent">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your YouTube analytics and automate reports</p>
          </div>
        </div>
      </div>
    </div>
  );
}
