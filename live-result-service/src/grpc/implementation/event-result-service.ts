import EventWatcher from '../../persistence/event-watcher';
import { IEvent } from '../../persistence/models/event.model';

export default function EventResultChange(event: { request: IEvent; }) {
  console.log(`Received new result: ${JSON.stringify(event)}`);
  EventWatcher.emit({
    eventId: event.request.eventId,
    localTeamResult: event.request.localTeamResult,
    visitorTeamResult: event.request.visitorTeamResult
  });
  return {
    OK: true
  };
}
