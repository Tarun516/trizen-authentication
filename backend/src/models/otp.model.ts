import mongoose, { Schema, Document } from "mongoose";

export interface IOtp extends Document {
  email: string;
  otp: string;
  createdAt: Date;
  expiresAt: Date;
}

const otpSchema = new Schema<IOtp>(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    otp: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Otp =
  (mongoose.models.Otp as mongoose.Model<IOtp>) ||
  mongoose.model<IOtp>("Otp", otpSchema);
