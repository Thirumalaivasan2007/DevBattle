"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2, CheckCircle, XCircle } from 'lucide-react';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function AdminReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await api.get('/admin/reports');
        setReports(response.data);
      } catch (error: any) {
        toast.error("Failed to fetch reports", {
          description: error.response?.data?.message || "Internal server error"
        });
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [toast]);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await api.put(`/admin/reports/${id}/status`, { status });
      toast.success(`Report marked as ${status}`);
      setReports(reports.map(r => r._id === id ? { ...r, status: res.data.status } : r));
    } catch (error: any) {
      toast.error("Failed to update report", {
        description: error.response?.data?.message || "Internal server error"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this report record?')) return;
    try {
      await api.delete(`/admin/reports/${id}`);
      toast.success("Report deleted successfully");
      setReports(reports.filter(r => r._id !== id));
    } catch (error: any) {
      toast.error("Failed to delete report", {
        description: error.response?.data?.message || "Internal server error"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports Management</h1>
          <p className="text-muted-foreground">Review and moderate community reports.</p>
        </div>
      </div>

      <Card className="border-border/40 shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="rounded-md border-0 overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>Reporter</TableHead>
                    <TableHead>Target Type</TableHead>
                    <TableHead>Target ID</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No reports found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    reports.map((report) => (
                      <TableRow key={report._id}>
                        <TableCell className="font-medium">
                          {report.reporterId?.username || 'Unknown'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{report.targetModel}</Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs font-mono text-muted-foreground">{report.targetId}</span>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate" title={report.reason}>
                          {report.reason}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={report.status === 'RESOLVED' ? 'default' : report.status === 'DISMISSED' ? 'outline' : 'destructive'}
                          >
                            {report.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {report.status !== 'RESOLVED' && (
                              <Button variant="ghost" size="icon" title="Mark as Resolved" onClick={() => handleUpdateStatus(report._id, 'RESOLVED')}>
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              </Button>
                            )}
                            {report.status !== 'DISMISSED' && (
                              <Button variant="ghost" size="icon" title="Dismiss Report" onClick={() => handleUpdateStatus(report._id, 'DISMISSED')}>
                                <XCircle className="h-4 w-4 text-orange-500" />
                              </Button>
                            )}
                            <Button variant="ghost" size="icon" title="Delete Record" onClick={() => handleDelete(report._id)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
