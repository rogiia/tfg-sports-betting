import * as express from 'express';
import * as helmet from 'helmet';
import * as compression from 'compression';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';

import {
  GetUserBetsController,
  PlaceBetController
} from './controllers';
import Persistence from './persistence';

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
      Persistence.connect();
      console.log('Successfully connected to MongoDB');
    } catch (err) {
      throw err;
    }
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({
      extended: true
    })); 
    this.app.use(function (req, res, next) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-type,Authorization');
      next();
    });
    this.app.use(morgan('combined'));
    this.app.use('/bet', GetUserBetsController);
    this.app.use('/bet', PlaceBetController);
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
