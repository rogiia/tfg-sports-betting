import * as mongoose from 'mongoose';

export interface IEvent {
  eventId: String;
  localTeamResult: Number;
  visitorTeamResult: Number;
}

const eventSchema: mongoose.Schema = new mongoose.Schema({
  eventId: String,
  localTeamResult: Number,
  visitorTeamResult: Number
});

export default mongoose.model<mongoose.Document & IEvent>('Event', eventSchema);