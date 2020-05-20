export interface IEvent {
  eventId: string;
  sport: string;
  localTeam: string;
  visitorTeam: string;
  ended: boolean;
}

const URL = 'http://events.sports-betting'

export async function getEventsBySport(sport: string): Promise<IEvent[]> {
  const response = await fetch(`${URL}/sport/${sport}/event`);
  if (response.status === 200) {
    const result = await response.json();
    if (result && result.length > 0) {
      return result.map((event: any) => {
        return {
          eventId: event._id,
          sport: event.sport,
          localTeam: event.localTeam,
          visitorTeam: event.visitorTeam,
          ended: event.ended
        };
      });
    }
  }
  return [];
}

export async function getEventDetails(eventId: string): Promise<IEvent | null> {
  const response = await fetch(`${URL}/event/${eventId}`);
  if (response.status === 200) {
    const result = await response.json();
    if (result) {
      return {
        eventId: result._id,
        sport: result.sport,
        localTeam: result.localTeam,
        visitorTeam: result.visitorTeam,
        ended: result.ended
      };
    }
  }
  return null;
}