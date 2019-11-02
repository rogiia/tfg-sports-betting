import * as mongoose from 'mongoose';

export interface IBet {
  eventId: string;
  userId: string;
  result: 'L' | 'D' | 'V';
  winner: boolean | null;
  claimed: boolean;
  amount: number;
  stake: number;
}

const betSchema: mongoose.Schema = new mongoose.Schema({
  eventId: String,
  userId: String,
  result: String,
  winner: Boolean,
  claimed: Boolean,
  amount: Number,
  stake: Number
});

export default mongoose.model<mongoose.Document & IBet>('Bet', betSchema);