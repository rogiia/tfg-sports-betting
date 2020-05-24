import * as express from 'express';
import {
  OK,
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED,
  FORBIDDEN
} from 'http-status-codes';
import * as jwt from 'jsonwebtoken';
import Persistence from '../persistence';
import { getToken } from '../utils/get-token';

const router = express.Router();

function containsUserId(decoded: object | string): decoded is { username: string } {
  return typeof decoded === 'object' && decoded.hasOwnProperty('username');
}

router.get('/', async(req: express.Request, res: express.Response) => {
  try {
    const token = getToken(req);
    if (token) {
      const decoded = jwt.decode(token);
      if (decoded === null) {
        res.status(FORBIDDEN).json({ message: 'Invalid token' });
      } else {
        if (containsUserId(decoded)) {
          const bets = await Persistence.findBetsByUser(decoded.username);
          res.status(OK).json({ bets });
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