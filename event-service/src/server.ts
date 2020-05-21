import * as express from 'express';
import * as helmet from 'helmet';
import * as compression from 'compression';
import * as morgan from 'morgan';

import {
  GetEventDetailsController,
  GetEventsBySportController
} from './controllers';
import Persistence from './persistence';
import QueueReceiver from './queue/receiver';

export default class Server {
  private static instance: Server | null = null;

  public static getServer(): Server {
    if (!Server.instance) {
      Server.instance = new Server();
    } 
    return Server.instance;
  }

  public app: express.Application;

  public constructor() {
    this.app = express();
  }

  public async start(port: number = 3000): Promise<void> {
    try {
      await Persistence.connect();
      console.log('Successfully connected to MongoDB');
    } catch(err) {
      throw err;
    }
    QueueReceiver.listen();
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(morgan('combined'));

    this.app.use(function (req, res, next) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
      next();
    });

    this.app.use('/event', GetEventDetailsController);
    this.app.use('/sport', GetEventsBySportController);
    const listener = this.app.listen(port, () => console.log(`Server listening on port ${port}`));
    listener.on('close', () => {
      Persistence.disconnect();
      console.log('Closing server...');
    });
    listener.on('error', (err: Error) => {
      console.error(err);
    });
  }
}
