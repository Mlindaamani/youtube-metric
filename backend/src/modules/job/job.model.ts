import mongoose from 'mongoose';

export interface IJob extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  userId: string;
  name: string;
  type: 'report_generation';
  frequency: 'daily' | 'weekly' | 'monthly';
  period: string;
  parameters: {
    period: string;
    metrics?: string[];
    reportType?: string;
  };
  cronExpression: string;
  isActive: boolean;
  nextRun: Date;
  lastRun?: Date;
  runCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['report_generation'],
    default: 'report_generation'
  },
  frequency: {
    type: String,
    required: true,
    enum: ['daily', 'weekly', 'monthly']
  },
  period: {
    type: String,
    required: true
  },
  parameters: {
    period: String,
    metrics: [String],
    reportType: String
  },
  cronExpression: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  nextRun: {
    type: Date,
    required: true
  },
  lastRun: {
    type: Date
  },
  runCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for efficient querying
jobSchema.index({ userId: 1, isActive: 1 });
jobSchema.index({ nextRun: 1, isActive: 1 });

export const Job = mongoose.model<IJob>('Job', jobSchema);