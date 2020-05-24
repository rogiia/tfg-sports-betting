export type ResultType = 'L' | 'D' | 'V';

export interface IBet {
  eventId: string;
  userId: string;
  result: ResultType;
  winner: boolean | null;
  claimed: boolean;
  amount: number;
  stake: number;
}

const URL = 'http://bets.sports-betting';

export async function getUserBets(token: string): Promise<IBet[]> {
  const response = await fetch(`${URL}/bet`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (response.status === 200) {
    const result = await response.json();
    if (result.bets && result.bets.length) {
      return result.bets;
    }
  }
  return [];
}

export async function placeBet(token: string, eventId: string, result: ResultType, amount: number, stake: number): Promise<IBet> {
  const response = await fetch(`${URL}/bet`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      eventId,
      result,
      amount,
      stake
    })
  });
  if (response.status === 200) {
    const result = await response.json();
    if (result.result) {
      return result.result;
    }
  }
  throw new Error(`Error placing bet: ${response}`);
}