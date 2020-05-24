import * as express from 'express';
import {
  OK,
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED,
  FORBIDDEN,
  BAD_REQUEST,
  PAYMENT_REQUIRED
} from 'http-status-codes';
import * as jwt from 'jsonwebtoken';
import Persistence from '../persistence';
import { BalanceService } from '../grpc';
import { getToken } from '../utils/get-token';

const balanceService = new BalanceService();
const router = express.Router();

function containsUserId(decoded: object | string): decoded is { username: string } {
  return typeof decoded === 'object' && decoded.hasOwnProperty('username');
}

function isValidResult(result: string): result is 'L' | 'D' | 'V' {
  return result === 'L' || result === 'D' || result === 'V';
}

router.post('/', async(req: express.Request, res: express.Response) => {
  try {
    const token = getToken(req);
    const {
      eventId,
      result,
      amount,
      stake
    } = req.body;
    if (token) {
      const decoded = jwt.decode(token);
      if (decoded === null) {
        res.status(FORBIDDEN).json({ message: 'Invalid token' });
      } else {
        if (containsUserId(decoded)) {
          if (isValidResult(result)) {
            console.log(`Placing bet for user ${decoded.username} on event ${eventId}`);
            console.log(`Paying ${amount}`);
            const payment = await balanceService.payBet({
              userId: decoded.username,
              amount
            });
            if (payment) {
              console.log('Payment successful');
              console.log('Creating new bet...');
              const createdBet = await Persistence.create({
                eventId,
                userId: decoded.username,
                winner: null,
                result,
                claimed: false,
                amount,
                stake
              });
              console.log('Success');
              res.status(OK).json({ result: createdBet });
            } else {
              res.status(PAYMENT_REQUIRED).json({ message: 'Payment failed' });
            }
          } else {
            res.status(BAD_REQUEST).json({ message: 'Invalid result' });
          }
        } else {
          res.status(FORBIDDEN).json({ message: 'Malformed token' });
        }
      }
    } else {
      res.status(UNAUTHORIZED).json({ message: 'Missing authorization' });
    }
  } catch(err) {
    console.error(err);
    res.status(INTERNAL_SERVER_ERROR).json({ message: 'An unexpected error ocurred. Please contact with the system administrator and try again later.' });
  }
});

export default router;