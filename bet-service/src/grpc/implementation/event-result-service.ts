import EventWatcher from '../../persistence/event-watcher';
import { IEvent } from '../../persistence/models/event.model';

export default function EventResultChange(request: IEvent) {
  EventWatcher.emit({
    eventId: request.eventId,
    localTeamResult: request.localTeamResult,
    visitorTeamResult: request.visitorTeamResult
  });
  return {
    OK: true
  };
}