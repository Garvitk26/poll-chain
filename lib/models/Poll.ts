import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPollOption {
  id: string;
  label: string;
  memo: string;
  votes: number;
}

export interface IPoll extends Document {
  title: string;
  description?: string;
  creatorId: string;
  collectorWallet: string;
  collectorSecretEncrypted: string;
  options: IPollOption[];
  status: 'draft' | 'active' | 'closed' | 'archived';
  closesAt?: Date;
  voteAmount: number;
  totalVotes: number;
  isPublic: boolean;
  requireWallet: boolean;
  tags: string[];
  contractPollId?: number;
  createdAt: Date;
  updatedAt: Date;
}

const PollOptionSchema: Schema<IPollOption> = new Schema({
  id: { type: String, required: true },
  label: { type: String, required: true },
  memo: { type: String, required: true, maxlength: 28 },
  votes: { type: Number, default: 0 }
}, { _id: false });

const PollSchema: Schema<IPoll> = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  creatorId: { type: String, required: true },
  collectorWallet: { type: String, unique: true },
  collectorSecretEncrypted: { type: String, select: false }, // Never select by default
  options: [PollOptionSchema],
  status: { type: String, enum: ['draft', 'active', 'closed', 'archived'], default: 'draft' },
  closesAt: { type: Date },
  voteAmount: { type: Number, default: 0.0000100 },
  totalVotes: { type: Number, default: 0 },
  isPublic: { type: Boolean, default: true },
  requireWallet: { type: Boolean, default: true },
  tags: [{ type: String }],
  contractPollId: { type: Number },
}, { timestamps: true });

const Poll: Model<IPoll> = mongoose.models.Poll || mongoose.model<IPoll>('Poll', PollSchema);

export default Poll;
