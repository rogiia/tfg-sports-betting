import * as express from 'express';
import {
  OK,
  INTERNAL_SERVER_ERROR
} from 'http-status-codes';
import Persistence from '../persistence';
import {
  IEvent
} from '../persistence/models/event.model';

const router = express.Router();

router.post('/', async(req: express.Request, res: express.Response) => {
  try {
    const {
      eventId,
      localTeamResult,
      visitorTeamResult
    } = req.body;
    const event: IEvent = {
      eventId,
      localTeamResult: parseInt(localTeamResult),
      visitorTeamResult: parseInt(visitorTeamResult)
    };
    const existingEvent = await Persistence.findEventByEventId(eventId);
    let result;
    if (existingEvent) {
      result = Persistence.update(event);
    } else {
      result = Persistence.create(event);
    }
    res.status(OK).json(result);
  } catch(err) {
    console.error(err);
    res.status(INTERNAL_SERVER_ERROR).json({ message: 'An unexpected error ocurred. Please contact with the system administrator and try again later.' });
  }
});

export default router;