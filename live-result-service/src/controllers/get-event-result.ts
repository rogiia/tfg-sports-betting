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
    res.writeHead(OK, {
      'Connection': 'keep-alive',
      'cache-control': 'no-cache',
      'Content-Type': 'text/event-stream'
    });
    res.write('\n');
    const interval = setInterval(() => {
      res.write(`data: keep alive\n\n`);
    }, 60 * 1000);
  
    req.on('close', () => {
      clearInterval(interval);
    });
    const subscription = EventWatcher.subscribe(eventId, (event: IEvent) => {
      res.write(`data: ${JSON.stringify(event)}\n\n`);
    });
    if (subscription.event) {
      res.write(`data: ${JSON.stringify(subscription.event)}\n\n`);
    } else {
      console.log(`Event ${eventId} not found, ending stream...`);
      res.end();
    }
    if (subscription.unsubscribe) {
      setTimeout(() => {
        console.log(`Stream for ${eventId} timed out after 1 hour`);
        if (subscription && subscription.unsubscribe) {
          subscription.unsubscribe();
        }
        clearInterval(interval);
        res.end();
      }, STREAM_TIMEOUT);
    }
  } catch(err) {
    console.error(err);
    res.status(INTERNAL_SERVER_ERROR).json({ message: 'An unexpected error ocurred. Please contact with the system administrator and try again later.' });
  }
});

export default router;