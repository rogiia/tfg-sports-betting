import * as express from 'express';
import {
  OK,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR
} from 'http-status-codes';
import EventWatcher from '../persistence/event-watcher';
import { IEvent } from '../persistence/models/event.model';

// Timeout after 1 hour
const STREAM_TIMEOUT = 3600000;

const router = express.Router();

router.get('/:event_id', async(req: express.Request, res: express.Response) => {
  try {
    const eventId = req.params['event_id'];
    res.status(OK).set({
      connection: "keep-alive",
      "cache-control": "no-cache",
      "Content-Type": "text/event-stream"
    });
    const subscription = EventWatcher.subscribe(eventId, (event: IEvent) => {
      res.write(event);
    });
    if (subscription.event) {
      res.write(subscription.event);
    } else {
      res.status(NOT_FOUND).json({ message: `Could not find event ${eventId}` });
    }
    if (subscription.unsubscribe) {
      setTimeout(subscription.unsubscribe, STREAM_TIMEOUT);
      res.end();
    }
  } catch(err) {
    console.error(err);
    res.status(INTERNAL_SERVER_ERROR).json({ message: 'An unexpected error ocurred. Please contact with the system administrator and try again later.' });
  }
});

export default router;