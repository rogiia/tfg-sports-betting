"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose = require("mongoose");
const event_model_1 = require("./models/event.model");
const MONGO_URL = process.env['MONGO_URL'] || 'mongodb://localhost/repo';
const MONGO_USER = process.env['MONGO_USER'] || 'root';
const MONGO_PWD = process.env['MONGO_PASSWORD'] || '';
const MONGO_RETRIES = parseInt(process.env['MONGO_RETRIES'] || '3');
class MongoConnectionError extends Error {
    constructor() {
        super('MongoDB connection is not active. Cannot perform query.');
    }
}
class Persistence {
    static connect() {
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
    static findEventsBySport(sport) {
        return new Promise((resolve, reject) => {
            if (!mongoose.connection) {
                reject(new MongoConnectionError());
            }
            event_model_1.default.find({ sport }, (err, res) => {
                if (err) {
                    reject(err);
                }
                resolve(res);
            });
        });
    }
    static findEventById(id) {
        return new Promise((resolve, reject) => {
            if (!mongoose.connection) {
                reject(new MongoConnectionError());
            }
            event_model_1.default.findById(id, (err, res) => {
                if (err) {
                    reject(err);
                }
                resolve(res);
            });
        });
    }
    static create(event) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!mongoose.connection) {
                throw new MongoConnectionError();
            }
            return yield event_model_1.default.create(event);
        });
    }
    static disconnect() {
        return new Promise((resolve, reject) => {
            mongoose.connection.close((err) => {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        });
    }
}
exports.default = Persistence;
