import * as express from 'express';
import {
  OK,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR
} from 'http-status-codes';
import Persistence from '../persistence';

const router = express.Router();

router.get('/:event_id', async(req: express.Request, res: express.Response) => {
  try {
    const eventId = req.params['event_id'];
    const result = await Persistence.findEventByEventId(eventId);
    if (result === null) {
      res.status(NOT_FOUND).json({ message: `No events were found with id ${eventId}`});
    }
    res.status(OK).json(result);
  } catch(err) {
    console.error(err);
    res.status(INTERNAL_SERVER_ERROR).json({ message: 'An unexpected error ocurred. Please contact with the system administrator and try again later.' });
  }
});

export default router;