"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
const NODE_PORT = process.env['NODE_PORT'];
const server = server_1.default.getServer();
server.start(NODE_PORT ? parseInt(NODE_PORT) : undefined);
