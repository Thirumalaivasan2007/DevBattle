import mongoose, { Schema, Document } from 'mongoose';

export interface IJudgeMetrics extends Document {
  timestamp: Date;
  totalExecutions: number;
  activeWorkers: number;
  queueSize: number;
  averageRuntime: number;
  cpuUsagePercent: number;
  memoryUsageMb: number;
}

const JudgeMetricsSchema: Schema = new Schema({
  timestamp: { type: Date, default: Date.now },
  totalExecutions: { type: Number, default: 0 },
  activeWorkers: { type: Number, default: 0 },
  queueSize: { type: Number, default: 0 },
  averageRuntime: { type: Number, default: 0 },
  cpuUsagePercent: { type: Number, default: 0 },
  memoryUsageMb: { type: Number, default: 0 }
});

export default mongoose.models.JudgeMetrics || mongoose.model<IJudgeMetrics>('JudgeMetrics', JudgeMetricsSchema);
