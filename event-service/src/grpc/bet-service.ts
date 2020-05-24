import {
  credentials
} from 'grpc';

function loadProtoDescriptors() {
  const PROTO_PATH = __dirname + '/protos/bet-service.proto';
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

export default class BetService {

  private client: any;

  constructor() {
    const packageDefinition = loadProtoDescriptors();
    this.client = new packageDefinition.BetService('bet-service:50051', credentials.createInsecure());
  }

  public settleEndedEvent(event: {
    eventId: string;
    result: 'L' | 'D' | 'V';
  }): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.client.settleEndedEvent({
        eventId: event.eventId,
        result: event.result
      }, (err: Error, result: { OK: boolean }) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.OK);
        }
      });
    });
  }

}