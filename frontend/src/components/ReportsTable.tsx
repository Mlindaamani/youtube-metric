import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Report } from '@/store/useStore';
import { reportApi } from '@/lib/api';
import { History, Download, Clock, FileText, Search, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ReportsTableProps {
  reports: Report[];
}

const CHART_COLORS = ['hsl(184, 100%, 50%)', 'hsl(200, 100%, 45%)', 'hsl(220, 80%, 55%)', 'hsl(260, 70%, 60%)'];

export function ReportsTable({ reports }: ReportsTableProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReports = useMemo(() => {
    if (!searchQuery.trim()) return reports;
    const query = searchQuery.toLowerCase();
    return reports.filter(
      (report) =>
        report.title.toLowerCase().includes(query) ||
        report.period.toLowerCase().includes(query) ||
        report.type.toLowerCase().includes(query)
    );
  }, [reports, searchQuery]);

  // Chart data
  const typeDistribution = useMemo(() => {
    const manual = reports.filter(r => r.type === 'manual').length;
    const scheduled = reports.filter(r => r.type === 'scheduled').length;
    return [
      { name: 'Manual', value: manual },
      { name: 'Scheduled', value: scheduled },
    ];
  }, [reports]);

  const monthlyReports = useMemo(() => {
    const months: Record<string, number> = {};
    reports.forEach(report => {
      const date = new Date(report.generatedAt);
      const key = date.toLocaleDateString('en-US', { month: 'short' });
      months[key] = (months[key] || 0) + 1;
    });
    return Object.entries(months).map(([name, count]) => ({ name, count }));
  }, [reports]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDownload = (id: string) => {
    window.open(reportApi.download(id), '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Charts Section */}
      {reports.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
          <Card className="border-brand/20 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-brand" />
                <CardTitle className="text-sm font-medium">Reports by Month</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyReports}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ 
                        background: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        boxShadow: '0 10px 40px -10px hsl(184 100% 50% / 0.2)'
                      }}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Bar dataKey="count" fill="hsl(184, 100%, 50%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-brand/20 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-brand" />
                <CardTitle className="text-sm font-medium">Report Types</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[180px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={typeDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {typeDistribution.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        background: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute flex gap-4">
                  {typeDistribution.map((item, i) => (
                    <div key={item.name} className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS[i] }} />
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Reports Table */}
      <Card className="animate-slide-up border-brand/20 bg-card/50 backdrop-blur-sm" style={{ animationDelay: '0.2s' }}>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-brand">
                <History className="h-5 w-5 text-brand-foreground" />
              </div>
              <div>
                <CardTitle>Report History</CardTitle>
                <CardDescription>View and download your generated reports</CardDescription>
              </div>
            </div>
            
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background/50 border-brand/20 focus:border-brand/50"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredReports.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 text-brand opacity-50" />
              <p className="text-lg font-medium">{searchQuery ? 'No matching reports' : 'No reports yet'}</p>
              <p className="text-sm">{searchQuery ? 'Try a different search term' : 'Generate your first report to see it here'}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Desktop view */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-brand/10">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-brand uppercase tracking-wider">Title</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-brand uppercase tracking-wider">Period</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-brand uppercase tracking-wider">Generated</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-brand uppercase tracking-wider">Type</th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-brand uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReports.map((report, index) => (
                      <tr 
                        key={report.id} 
                        className="border-b border-border/20 last:border-0 hover:bg-brand/5 transition-colors"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-brand/10 border border-brand/20">
                              <FileText className="h-4 w-4 text-brand" />
                            </div>
                            <span className="font-medium text-foreground">{report.title}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-muted-foreground">{report.period}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-3 w-3 text-brand" />
                            {formatDate(report.generatedAt)}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge 
                            variant={report.type === 'manual' ? 'secondary' : 'outline'}
                            className={report.type === 'scheduled' ? 'border-brand/30 text-brand' : ''}
                          >
                            {report.type}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDownload(report.id)}
                          >
                            <Download className="h-4 w-4" />
                            Download
                          </Button>
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
                    key={report.id}
                    className="p-4 rounded-xl bg-background/30 border border-brand/20 hover:border-brand/40 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-brand/10 border border-brand/20">
                          <FileText className="h-4 w-4 text-brand" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{report.title}</p>
                          <p className="text-sm text-muted-foreground">{report.period}</p>
                        </div>
                      </div>
                      <Badge 
                        variant={report.type === 'manual' ? 'secondary' : 'outline'}
                        className={report.type === 'scheduled' ? 'border-brand/30 text-brand' : ''}
                      >
                        {report.type}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3 text-brand" />
                        {formatDate(report.generatedAt)}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownload(report.id)}
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}