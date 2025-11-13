import mongoose, { Schema, Document, Model } from 'mongoose';
import crypto from 'crypto';

export interface IPasswordResetToken extends Document {
  _id: string;
  userId: mongoose.Types.ObjectId;
  token: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPasswordResetTokenModel extends Model<IPasswordResetToken> {
  generateToken(): string;
}

const PasswordResetTokenSchema = new Schema<IPasswordResetToken>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    token: {
      type: String,
      required: [true, 'Token is required'],
      unique: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: [true, 'Expiration date is required'],
      index: { expireAfterSeconds: 0 }, // Auto-delete expired tokens
    },
    used: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Generate a secure random token (static method)
PasswordResetTokenSchema.statics.generateToken = function(): string {
  return crypto.randomBytes(32).toString('hex');
};

// Create index for faster lookups
PasswordResetTokenSchema.index({ token: 1, used: 1 });
PasswordResetTokenSchema.index({ userId: 1, used: 1 });

const PasswordResetToken: IPasswordResetTokenModel =
  (mongoose.models.PasswordResetToken as unknown as IPasswordResetTokenModel) ||
  mongoose.model<IPasswordResetToken, IPasswordResetTokenModel>('PasswordResetToken', PasswordResetTokenSchema);

export default PasswordResetToken;

