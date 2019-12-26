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

const JWT_SECRET = process.env['JWT_SECRET'] || 'magic';
const balanceService = new BalanceService();
const router = express.Router();

function containsUserId(decoded: object | string): decoded is { userId: string } {
  return typeof decoded === 'object' && decoded.hasOwnProperty('userId');
}

function isValidResult(result: string): result is 'L' | 'D' | 'V' {
  return result === 'L' || result === 'D' || result === 'V';
}

router.post('/', async(req: express.Request, res: express.Response) => {
  try {
    const token = req.headers['authorization'];
    const {
      eventId,
      result,
      amount,
      stake
    } = req.body;
    if (token) {
      jwt.verify(token, JWT_SECRET, async(err, decoded) => {
        if (err) {
          res.status(FORBIDDEN).json({ message: err });
        } else {
          if (containsUserId(decoded)) {
            if (isValidResult(result)) {
              const payment = await balanceService.payBet({
                userId: decoded.userId,
                amount
              });
              if (payment) {
                const createdBet = await Persistence.create({
                  eventId,
                  userId: decoded.userId,
                  winner: null,
                  result,
                  claimed: false,
                  amount,
                  stake
                });
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
      });
    } else {
      res.status(UNAUTHORIZED).json({ message: 'Missing authorization' });
    }
  } catch(err) {
    console.error(err);
    res.status(INTERNAL_SERVER_ERROR).json({ message: 'An unexpected error ocurred. Please contact with the system administrator and try again later.' });
  }
});

export default router;