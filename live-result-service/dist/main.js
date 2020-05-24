"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
const grpc_1 = require("./grpc");
const NODE_PORT = process.env['NODE_PORT'];
const httpServer = server_1.default.getServer();
httpServer.start(NODE_PORT ? parseInt(NODE_PORT) : undefined);
const grpcServer = new grpc_1.default();
grpcServer.start();
