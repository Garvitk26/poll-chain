import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: 'creator' | 'voter';
  linkedWallet?: string;
  avatarColor: string;
  createdAt: Date;
  lastLogin?: Date;
  rememberMe?: boolean;
  failedLoginAttempts: number;
  lockedUntil?: Date;
  preferences: {
    emailOnVote: boolean;
    emailOnPollClose: boolean;
    securityAlerts: boolean;
  };
}

const UserSchema: Schema<IUser> = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['creator', 'voter'], required: true },
  linkedWallet: { type: String },
  avatarColor: { type: String, default: '#06b6d4' },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
  rememberMe: { type: Boolean, default: false },
  failedLoginAttempts: { type: Number, default: 0 },
  lockedUntil: { type: Date },
  preferences: {
    emailOnVote: { type: Boolean, default: true },
    emailOnPollClose: { type: Boolean, default: true },
    securityAlerts: { type: Boolean, default: true }
  }
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
