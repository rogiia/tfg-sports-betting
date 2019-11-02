import Server from './server';
import { GRPCServer } from './grpc';
const NODE_PORT = process.env['NODE_PORT'];
const httpServer = Server.getServer();
httpServer.start(NODE_PORT ? parseInt(NODE_PORT) : undefined);
const grpcServer = new GRPCServer();
grpcServer.start();
