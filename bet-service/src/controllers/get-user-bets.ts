import * as express from 'express';
import {
  OK,
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED,
  FORBIDDEN
} from 'http-status-codes';
import * as jwt from 'jsonwebtoken';
import Persistence from '../persistence';

const JWT_SECRET = process.env['JWT_SECRET'] || 'magic';
const router = express.Router();

function containsUserId(decoded: object | string): decoded is { userId: string } {
  return typeof decoded === 'object' && decoded.hasOwnProperty('userId');
}

router.get('/', async(req: express.Request, res: express.Response) => {
  try {
    const token = req.headers['authorization'];
    if (token) {
      jwt.verify(token, JWT_SECRET, async(err, decoded) => {
        if (err) {
          res.status(FORBIDDEN).json({ message: err });
        } else {
          if (containsUserId(decoded)) {
            const bets = await Persistence.findBetsByUser(decoded.userId);
            res.status(OK).json({ bets });
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