import Persistence from '../../persistence';

export default async function SettleEndedEvent(params: { request: {
  eventId: string;
  result: 'L' | 'D' | 'V'
}}) {
  console.log(`Received ending of event ${JSON.stringify(params)}`);
  const { BalanceService } = await import('..');
  const balanceService = new BalanceService();
  const betsToSettle = await Persistence.findBetsByEventId(params.request.eventId);
  for (let i = 0; i < betsToSettle.length; i++) {
    const bet = betsToSettle[i];
    console.log(`Settling bet ${bet._id}`);
    if (bet.result === params.request.result) {
      console.log(`User ${bet.userId} has won the bet ${bet._id}, paying ${bet.amount * bet.stake}...`);
      const cashBetResult = await balanceService.cashBet({
        userId: bet.userId,
        prize: bet.amount * bet.stake
      });
      if (cashBetResult && bet._id) {
        console.log(`Payment successful, bet ${bet._id} settled`);
        const settleResult = await Persistence.settleBet(bet._id, true);
        if (settleResult === null) {
          console.error(`Error cashing bet ${bet._id} for event ${bet.eventId} and user ${bet.userId}`);
        }
      } else {
        console.error(`Error cashing bet ${bet._id} for event ${bet.eventId} and user ${bet.userId}`);
      }
    } else {
      console.log(`User ${bet.userId} has lost the bet ${bet._id}`);
      if (bet._id) {
        console.log(`Settling bet ${bet._id} as lost`);
        const settleResult = await Persistence.settleBet(bet._id, false);
        if (settleResult === null) {
          console.error(`Error cashing bet ${bet._id} for event ${bet.eventId} and user ${bet.userId}`);
        }
      } else {
        console.error(`Error cashing bet ${bet._id} for event ${bet.eventId} and user ${bet.userId}`);
      }
    }
  }
  return {
    OK: true
  };
}