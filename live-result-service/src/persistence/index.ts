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
      console.log(`Connecting to MongoDB at URL ${MONGO_URL}`);
      mongoose.connect(`mongodb://${MONGO_USER}:${MONGO_PWD}@${MONGO_URL}/${MONGO_USER}`, {
        useNewUrlParser: true,
        reconnectTries: MONGO_RETRIES
      });
      const db = mongoose.connection;
      db.on('error', reject);
      db.once('open', resolve);
    });
  }

  public static findEventByEventId(eventId: string): Promise<IEvent | null> {
    return new Promise((resolve, reject) => {
      if (!mongoose.connection) {
        reject(new MongoConnectionError());
      }
      EventModel.find({
        eventId
      }, (err: Error, res: IEvent[]) => {
        if (err) {
          reject(err);
        } else if (res.length === 0) {
          resolve(null);
        }
        resolve(res[0]);
      });
    });
  }

  public static async create(event: IEvent): Promise<IEvent> {
    if (!mongoose.connection) {
      throw new MongoConnectionError();
    }
    return await EventModel.create(event);
  }

  public static async update(event: IEvent): Promise<IEvent> {
    return new Promise((resolve, reject) => {
      if (!mongoose.connection) {
        throw new MongoConnectionError();
      }
      EventModel.update({
        eventId: event.eventId
      }, event, (err, raw) => {
        if (err) {
          reject(err);
        }
        resolve(raw);
      });
    });
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