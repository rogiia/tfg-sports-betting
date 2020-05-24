export interface IEventResult {
  localTeamResult: number;
  visitorTeamResult: number;
}

const URL = 'http://live-result.sports-betting';

const subscribers: { [key: string]: ((result: IEventResult) => void)[] } = {};
let sources: { [key: string]: EventSource } = {};

export function subscribeEventResult(eventId: string, callback: (result: IEventResult) => void): () => void {
  if (!sources[eventId]) {
    sources[eventId] = new EventSource(`${URL}/event/${eventId}`);
    sources[eventId].addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      if (data && typeof data.localTeamResult === 'number' && typeof data.visitorTeamResult === 'number') {
        notifyAllSubscribers(eventId, {
          localTeamResult: data.localTeamResult,
          visitorTeamResult: data.visitorTeamResult
        })
      }
    });
  }
  if (subscribers[eventId]) {
    subscribers[eventId].push(callback);
  } else {
    subscribers[eventId] = [callback];
  }
  return () => {
    unsubscribe(eventId, callback);
  }
}

function unsubscribe(eventId: string, callback: (result: IEventResult) => void) {
  const index = subscribers[eventId].indexOf(callback);
  subscribers[eventId].splice(index, 1);
  if (sources[eventId] && subscribers[eventId].length === 0) {
    sources[eventId].close();
    delete sources[eventId];
    delete subscribers[eventId];
  }
}

function notifyAllSubscribers(eventId: string, result: IEventResult) {
  subscribers[eventId].forEach((callback) => {
    callback(result);
  });
}