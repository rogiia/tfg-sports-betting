"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const controllers_1 = require("./controllers");
const persistence_1 = require("./persistence");
class Server {
    constructor() {
        this.app = express();
    }
    static getServer() {
        if (!Server.instance) {
            Server.instance = new Server();
        }
        return Server.instance;
    }
    start(port = 3000) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                yield persistence_1.default.connect();
                console.log('Successfully connected to MongoDB');
            }
            catch (err) {
                throw err;
            }
            this.app.use(helmet());
            this.app.use(compression());
            this.app.use(morgan('combined'));
            this.app.use('/event', controllers_1.GetEventResultController);
            this.app.use('/publish', controllers_1.PublishEventUpdateController);
            const listener = this.app.listen(port, () => console.log(`Server listening on port ${port}`));
            listener.on('close', () => {
                persistence_1.default.disconnect();
                console.log('Closing server...');
            });
            listener.on('error', (err) => {
                console.error(err);
            });
        });
    }
}
exports.default = Server;
Server.instance = null;
