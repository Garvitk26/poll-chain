import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVote extends Document {
  pollId: string;
  voterId?: string;
  voterWallet: string;
  optionId: string;
  optionMemo: string;
  txHash: string;
  amount: number;
  confirmedAt?: Date;
  createdAt: Date;
}

const VoteSchema: Schema<IVote> = new Schema({
  pollId: { type: String, required: true },
  voterId: { type: String },
  voterWallet: { type: String, required: true },
  optionId: { type: String, required: true },
  optionMemo: { type: String },
  txHash: { type: String, required: true, unique: true },
  amount: { type: Number },
  confirmedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

const Vote: Model<IVote> = mongoose.models.Vote || mongoose.model<IVote>('Vote', VoteSchema);

export default Vote;
