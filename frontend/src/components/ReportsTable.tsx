import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Report } from '@/types';
import { reportsAPI } from '@/api/reports';
import { History, Download, Clock, FileText, Search, Trash2, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useReportsStore } from '@/store/reportsStore';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ReportsTableProps {
  reports: Report[];
}

export function ReportsTable({ reports }: ReportsTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<string | null>(null);
  const { fetchReports } = useReportsStore();

  const filteredReports = useMemo(() => {
    if (!searchQuery.trim()) return reports;
    const query = searchQuery.toLowerCase();
    return reports.filter(
      (report) =>
        report.title.toLowerCase().includes(query) ||
        report.period.toLowerCase().includes(query) ||
        report.generatedBy.toLowerCase().includes(query)
    );
  }, [reports, searchQuery]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDownload = async (id: string) => {
    try {
      const blob = await reportsAPI.download(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `report-${id}.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleDelete = async (id: string) => {
    setReportToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!reportToDelete) return;

    setDeletingId(reportToDelete);
    try {
      await reportsAPI.delete(reportToDelete);
      toast.success('Report deleted successfully');
      // Refresh the reports list
      await fetchReports();
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Failed to delete report');
    } finally {
      setDeletingId(null);
      setDeleteDialogOpen(false);
      setReportToDelete(null);
    }
  };

  return (
    <>
      <Card className="animate-slide-up border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-card to-card/80 dark:from-slate-950 dark:to-slate-900/80" style={{ animationDelay: '0.2s' }}>
      <CardHeader className="bg-gradient-to-r from-green-500/5 via-emerald-500/5 to-brand/5 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-brand/20 border-b border-green-200/20 dark:border-green-800/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
              <History className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Report History</CardTitle>
              <CardDescription>View, download, and manage your generated reports</CardDescription>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/50 border-green-200 dark:border-green-800 focus:ring-green-500"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
          {filteredReports.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 text-green-500 opacity-50" />
              <p className="text-lg font-medium">{searchQuery ? 'No matching reports' : 'No reports yet'}</p>
              <p className="text-sm">{searchQuery ? 'Try a different search term' : 'Generate your first report to see it here'}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Desktop view */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-green-200/20 dark:border-green-800/30">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider">Title</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider">Period</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider">Generated</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider">Type</th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReports.map((report, index) => (
                      <tr 
                        key={report._id} 
                        className="border-b border-green-200/10 dark:border-green-800/20 last:border-0 hover:bg-green-500/5 dark:hover:bg-green-900/20 transition-colors"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/50 border border-green-200 dark:border-green-800">
                              <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />
                            </div>
                            <span className="font-medium text-foreground">{report.title}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-muted-foreground">{report.period}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-3 w-3 text-green-600 dark:text-green-400" />
                            {formatDate(report.generatedAt)}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge 
                            variant={report.generatedBy === 'manual' ? 'secondary' : 'outline'}
                            className={report.generatedBy === 'scheduled' ? 'border-green-300 text-green-700 bg-green-50 dark:border-green-800 dark:bg-green-950 dark:text-green-300' : ''}
                          >
                            {report.generatedBy}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDownload(report._id)}
                              className="border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-950"
                            >
                              <Download className="h-4 w-4" />
                              Download
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDelete(report._id)}
                              disabled={deletingId === report._id}
                              className="border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950 text-red-600 dark:text-red-400 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                              {deletingId === report._id ? 'Deleting...' : 'Delete'}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile view */}
              <div className="md:hidden space-y-3">
                {filteredReports.map((report) => (
                  <div 
                    key={report._id}
                    className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200/50 dark:border-green-800/50 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/50 border border-green-200 dark:border-green-800">
                          <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{report.title}</p>
                          <p className="text-sm text-muted-foreground">{report.period}</p>
                        </div>
                      </div>
                      <Badge 
                        variant={report.generatedBy === 'manual' ? 'secondary' : 'outline'}
                        className={report.generatedBy === 'scheduled' ? 'border-green-300 text-green-700 bg-green-50 dark:border-green-800 dark:bg-green-950 dark:text-green-300' : ''}
                      >
                        {report.generatedBy}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3 text-green-600 dark:text-green-400" />
                        {formatDate(report.generatedAt)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-3 border-t border-green-200/50 dark:border-green-800/50">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownload(report._id)}
                        className="flex-1 border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-950"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDelete(report._id)}
                        disabled={deletingId === report._id}
                        className="flex-1 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950 text-red-600 dark:text-red-400 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                        {deletingId === report._id ? 'Deleting...' : 'Delete'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <AlertDialogTitle>Delete Report</AlertDialogTitle>
            </div>
          </AlertDialogHeader>
          <AlertDialogDescription className="text-foreground">
            Are you sure you want to delete this report? This action cannot be undone.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deletingId === reportToDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deletingId === reportToDelete ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}