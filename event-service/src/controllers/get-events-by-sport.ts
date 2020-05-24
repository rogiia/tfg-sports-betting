import * as express from 'express';
import {
  OK,
  NO_CONTENT,
  INTERNAL_SERVER_ERROR
} from 'http-status-codes';
import Persistence from '../persistence';

const router = express.Router();

router.get('/:sport_id/event', async(req: express.Request, res: express.Response) => {
  try {
    const sport = req.params['sport_id'];
    const result = await Persistence.findEventsBySport(sport);
    if (result.length === 0) {
      res.status(NO_CONTENT).json({ message: `No events were found for sport ${sport}`});
    } else {
      res.status(OK).json(result);
    }
  } catch(err) {
    console.error(err);
    res.status(INTERNAL_SERVER_ERROR).json({ message: 'An unexpected error ocurred. Please contact with the system administrator and try again later.' });
  }
});

export default router;