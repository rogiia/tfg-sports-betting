import Persistence from '../../persistence';

export default async function SettleBet(params: {
  betId: string;
  result: 'L' | 'D' | 'V'
}) {
  const { BalanceService } = await import('..');
  const balanceService = new BalanceService();
  const bet = await Persistence.findBetById(params.betId);
  if (bet) {
    const winner = bet.result === params.result;
    await Persistence.settleBet(params.betId, winner);
    if (winner) {
      await balanceService.cashBet({
        userId: bet.userId,
        prize: bet.amount * bet.stake
      });
    }
    return {
      OK: true,
      winner
    };
  }
  return {
    OK: false,
    winner: false
  };
}