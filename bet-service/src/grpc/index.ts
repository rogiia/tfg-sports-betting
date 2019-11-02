import {
  Server,
  ServerCredentials
} from 'grpc';

import EventResultImplementation from './implementation/event-result-service';

function loadProtoDescriptors() {
  const PROTO_PATH = __dirname + '/protos/event-result.proto';
  const grpc = require('grpc');
  const protoLoader = require('@grpc/proto-loader');
  // Suggested options for similarity to existing grpc.load behavior
  const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true
    }
  );
  const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
  return protoDescriptor;
}

export default class GRPCServer {

  private server: Server;

  constructor() {
    const GRPC_HOST = process.env['GRPC_HOST'] || '0.0.0.0';
    const GRPC_PORT = process.env['GRPC_PORT'] || 50051;
    this.server = new Server();
    const descriptors = loadProtoDescriptors();
    this.server.addProtoService(descriptors.eventresultservice, {
      EventResultChange: EventResultImplementation
    });
    this.server.bind(`${GRPC_HOST}:${GRPC_PORT}`, ServerCredentials.createInsecure());
  }

  public start() {
    this.server.start();
    console.log('Started GRPC server');
  }

  public shutdown(force?: boolean) {
    if (force) {
      this.server.forceShutdown();
    } else {
      this.server.tryShutdown(() => console.log('GRPC server shutdown'));
    }
  }

}