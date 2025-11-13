import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUsage extends Document {
  _id: string;
  userId: mongoose.Types.ObjectId;
  toolName: string;
  endpoint: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

const UsageSchema = new Schema<IUsage>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    toolName: {
      type: String,
      required: true,
      index: true,
    },
    endpoint: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
UsageSchema.index({ userId: 1, timestamp: -1 });
UsageSchema.index({ userId: 1, toolName: 1, timestamp: -1 });

// TTL index to auto-delete old usage records after 90 days
UsageSchema.index({ timestamp: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

const Usage: Model<IUsage> = mongoose.models.Usage || mongoose.model<IUsage>('Usage', UsageSchema);

export default Usage;

