import Server from './server';
const NODE_PORT = process.env['NODE_PORT'];
const server = Server.getServer();
server.start(NODE_PORT ? parseInt(NODE_PORT) : undefined);
