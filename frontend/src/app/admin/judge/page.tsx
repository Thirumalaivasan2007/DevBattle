'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Server, Activity, Cpu, HardDrive, RefreshCw } from 'lucide-react';
import api from '@/lib/axios';
import { toast } from 'sonner';

export default function JudgeAdminDashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMetrics = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/judge/metrics');
      setMetrics(res.data);
    } catch (error: any) {
      toast.error('Failed to fetch Judge metrics');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000); // auto-refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  if (isLoading && !metrics) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="container mx-auto p-6 max-w-7xl flex-1">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Judge Engine Dashboard</h1>
            <p className="text-muted-foreground mt-1">Real-time monitoring of Docker Sandbox & Execution Queue</p>
          </div>
          <Button onClick={fetchMetrics} disabled={isLoading} variant="outline">
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {metrics && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {/* Queue Status */}
              <Card>
                <CardHeader className="pb-2 flex flex-row justify-between items-center">
                  <CardTitle className="text-lg font-medium">Queue Size</CardTitle>
                  <Activity className="text-blue-500 w-5 h-5" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{metrics.queueStatus.pending}</div>
                  <p className="text-xs text-muted-foreground mt-1">{metrics.queueStatus.running} Currently Running</p>
                </CardContent>
              </Card>

              {/* Worker Status */}
              <Card>
                <CardHeader className="pb-2 flex flex-row justify-between items-center">
                  <CardTitle className="text-lg font-medium">Active Workers</CardTitle>
                  <Server className="text-green-500 w-5 h-5" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{metrics.workerStatus.activeWorkers} <span className="text-lg text-muted-foreground">/ {metrics.workerStatus.totalWorkers}</span></div>
                  <p className="text-xs text-muted-foreground mt-1">Status: {metrics.workerStatus.health}</p>
                </CardContent>
              </Card>

              {/* CPU Usage */}
              <Card>
                <CardHeader className="pb-2 flex flex-row justify-between items-center">
                  <CardTitle className="text-lg font-medium">CPU Usage</CardTitle>
                  <Cpu className="text-orange-500 w-5 h-5" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{metrics.systemMetrics.cpuUsage}%</div>
                  <p className="text-xs text-muted-foreground mt-1">Host CPU Load</p>
                </CardContent>
              </Card>

              {/* Memory Usage */}
              <Card>
                <CardHeader className="pb-2 flex flex-row justify-between items-center">
                  <CardTitle className="text-lg font-medium">Memory Usage</CardTitle>
                  <HardDrive className="text-purple-500 w-5 h-5" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{metrics.systemMetrics.memoryUsageMb} MB</div>
                  <p className="text-xs text-muted-foreground mt-1">Sandbox RAM Consumption</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Job History */}
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Recent Executions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {metrics.recentJobs.length === 0 ? (
                      <p className="text-muted-foreground text-center py-6">No recent jobs found.</p>
                    ) : (
                      metrics.recentJobs.map((job: any) => (
                        <div key={job._id} className="flex justify-between items-center border-b border-border pb-3 last:border-0 last:pb-0">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold">{job.language}</span>
                              <Badge variant={job.status === 'COMPLETED' ? 'default' : job.status === 'FAILED' ? 'destructive' : 'secondary'}
                                className={job.status === 'COMPLETED' ? 'bg-green-500/20 text-green-500' : ''}
                              >
                                {job.status}
                              </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground">User: {job.userId?.username || 'Unknown'} • Job ID: {job._id.substring(0,8)}...</div>
                          </div>
                          <div className="text-right">
                            <div className={`font-medium ${job.verdict === 'Accepted' || job.verdict === 'Success' ? 'text-green-500' : 'text-red-500'}`}>
                              {job.verdict || 'Running...'}
                            </div>
                            <div className="text-xs text-muted-foreground">{job.runtime ? `${job.runtime}ms` : '-'}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Engine Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Engine Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Execution Model</span>
                    <span className="font-medium">Docker Sandbox</span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Queue System</span>
                    <span className="font-medium">Async Event Loop</span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Time Limit</span>
                    <span className="font-medium">2000ms</span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Memory Limit</span>
                    <span className="font-medium">256MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Executions</span>
                    <span className="font-medium">{metrics.queueStatus.totalProcessed}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
