import {
  IEvent
} from './models/event.model';

type EventWatcherCallback = (event: IEvent) => void;
type EventResult = { localTeamResult: number; visitorTeamResult: number; };

export default class EventWatcher {
  private static events: { [key: string]: EventResult } = {};

  private static subscribers: { [eventId: string]: EventWatcherCallback[] } = {};

  public static subscribe(eventId: string, callback: EventWatcherCallback): {
    event: IEvent | null,
    unsubscribe?: (...args: any[]) => void
   } {
    let event = null;
    let unsubscribe;
    if (this.events.hasOwnProperty(eventId)) {
      event = this.events[eventId];
      if (this.subscribers.hasOwnProperty(eventId)) {
        this.subscribers[eventId].push(callback);
      } else {
        this.subscribers[eventId] = [callback];
      }
      unsubscribe = (...args: any[]) => {
        for (let i = 0; i < this.subscribers[eventId].length; i++) {
          if (this.subscribers[eventId][i] === callback) {
            this.subscribers[eventId].splice(i, 1);
          }
        }
      };
    }
    return {
      event: Object.assign(event, { eventId }),
      unsubscribe
    };
  }

  public static emit(event: IEvent): void {
    if (this.events.hasOwnProperty(event.eventId)) {
      this.events[event.eventId].localTeamResult = event.localTeamResult;
      this.events[event.eventId].visitorTeamResult = event.visitorTeamResult;
    } else {
      this.events[event.eventId] = {
        localTeamResult: event.localTeamResult,
        visitorTeamResult: event.visitorTeamResult
      };
    }
    if (this.subscribers[event.eventId]) {
      this.subscribers[event.eventId].forEach(callback => callback(event));
    }
  }
}