import * as mongoose from 'mongoose';

export interface IEvent {
  sport: string;
  localTeam: string;
  visitorTeam: string;
  ended: boolean;
}

const eventSchema: mongoose.Schema = new mongoose.Schema({
  sport: String,
  localTeam: String,
  visitorTeam: String,
  ended: Boolean
});

export default mongoose.model<mongoose.Document & IEvent>('Event', eventSchema);