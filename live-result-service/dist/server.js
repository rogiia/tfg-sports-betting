"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const controllers_1 = require("./controllers");
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
            this.app.use(helmet());
            this.app.use(compression());
            this.app.use(morgan('combined'));
            this.app.use('/event', controllers_1.GetEventResultController);
            const listener = this.app.listen(port, () => console.log(`Server listening on port ${port}`));
            listener.on('close', () => {
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
