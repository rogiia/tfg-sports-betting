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
      BetModel.findById(betId, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  public static findBetsByUser(userId: string): Promise<IBet[]> {
    return new Promise((resolve, reject) => {
      if (!mongoose.connection) {
        reject(new MongoConnectionError());
      }
      BetModel.find({ userId }, (err: Error, res: IBet[]) => {
        if (err) {
          reject(err);
        }
        resolve(res);
      });
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
      }, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
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