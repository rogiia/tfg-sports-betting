import * as mongoose from 'mongoose';
import EventModel, { IEvent } from './models/event.model';

const MONGO_URL = process.env['MONGO_URL'] || 'mongodb://localhost/repo';
const MONGO_USER = process.env['MONGO_USER'] || 'root';
const MONGO_PWD = process.env['MONGO_PASSWORD'] || '';
const MONGO_RETRIES = parseInt(process.env['MONGO_RETRIES'] || '3');

class MongoConnectionError extends Error {
  constructor() {
    super('MongoDB connection is not active. Cannot perform query.');
  }
}

export default class Persistence {
  public static connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log(`Connecting to MongoDB at URL ${MONGO_URL} using credentials ${MONGO_USER}:${MONGO_PWD}`);
      mongoose.connect(MONGO_URL, {
        useNewUrlParser: true,
        auth: {
          user: MONGO_USER,
          password: MONGO_PWD
        },
        reconnectTries: MONGO_RETRIES
      });
      const db = mongoose.connection;
      db.on('error', reject);
      db.once('open', resolve);
    });
  }

  public static findEventsBySport(sport: string): Promise<IEvent[]> {
    return new Promise((resolve, reject) => {
      if (!mongoose.connection) {
        reject(new MongoConnectionError());
      }
      EventModel.find({ sport }, (err: Error, res: IEvent[]) => {
        if (err) {
          reject(err);
        }
        resolve(res);
      });
    });
  }

  public static findEventById(id: string): Promise<IEvent | null> {
    return new Promise((resolve, reject) => {
      if (!mongoose.connection) {
        reject(new MongoConnectionError());
      }
      EventModel.findById(id, (err: Error, res: IEvent | null) => {
        if (err) {
          reject(err);
        }
        resolve(res);
      });
    });
  }

  public static async create(event: IEvent): Promise<IEvent> {
    if (!mongoose.connection) {
      throw new MongoConnectionError();
    }
    return await EventModel.create(event);
  }

  public static disconnect(): Promise<void> {
    return new Promise((resolve, reject) => {
      mongoose.connection.close((err: Error) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }
}