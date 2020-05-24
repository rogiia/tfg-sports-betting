import * as mongoose from 'mongoose';
import BetModel, { IBet } from './models/bet.model';

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

  public static findBetById(betId: string): Promise<IBet | null> {
    return new Promise((resolve, reject) => {
      if (!mongoose.connection) {
        reject(new MongoConnectionError());
      }
      BetModel.findById(betId).lean()
      .then(resolve)
      .catch(reject);
    });
  }

  public static findBetsByUser(userId: string): Promise<IBet[]> {
    return new Promise((resolve, reject) => {
      if (!mongoose.connection) {
        reject(new MongoConnectionError());
      }
      BetModel.find({ userId }).lean()
      .then((result: IBet[]) => {
        resolve(result.reverse());
      })
      .catch(reject);
    });
  }

  public static findBetsByEventId(eventId: string): Promise<IBet[]> {
    return new Promise((resolve, reject) => {
      if (!mongoose.connection) {
        reject(new MongoConnectionError());
      }
      BetModel.find({ eventId }).lean()
      .then(resolve)
      .catch(reject);
    });
  }

  public static async create(bet: IBet): Promise<mongoose.Document & IBet> {
    if (!mongoose.connection) {
      throw new MongoConnectionError();
    }
    return await BetModel.create(bet);
  }

  public static settleBet(betId: string, winner: boolean): Promise<IBet | null> {
    return new Promise((resolve, reject) => {
      if (!mongoose.connection) {
        throw new MongoConnectionError();
      }
      BetModel.findByIdAndUpdate(betId, {
        $set: {
          winner,
          claimed: true
        }
      }).lean()
      .then(resolve)
      .catch(reject);
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