const URL = 'http://balance.sports-betting';

export async function getUserBalance(token: string): Promise<number | null> {
  const response = await fetch(`${URL}/api/balance`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (response.status === 200) {
    const result = await response.json();
    if (result && result.balance) {
      return result.balance;
    }
  }
  return null;
}

export async function addBalance(token: string, amount: number): Promise<number> {
  const response = await fetch(`${URL}/api/balance`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      amount
    })
  });
  if (response.status === 200) {
    const result = await response.json();
    if (result && result.balance) {
      return result.balance;
    }
  }
  throw new Error(`Error adding balance to user: ${response}`);
}