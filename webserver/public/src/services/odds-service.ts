export interface IEventOdds {
  localOdds: number;
  drawOdds: number;
  visitorOdds: number;
}

const URL = 'http://odds.sports-betting';

export async function getEventOdds(sport: string, localTeamName: string, localTeamResult: number, visitorTeamName: string, visitorTeamResult: number): Promise<IEventOdds | null> {
  const response = await fetch(`${URL}/event-odds`, {
    method: 'POST',
    body: JSON.stringify({
      sport,
      localTeamName,
      localTeamResult,
      visitorTeamName,
      visitorTeamResult
    })
  });
  if (response.status === 200) {
    const result = await response.json();
    if (result) {
      return {
        localOdds: result.local_stake,
        drawOdds: result.draw_stake,
        visitorOdds: result.visitor_stake
      };
    }
  }
  return null;
}