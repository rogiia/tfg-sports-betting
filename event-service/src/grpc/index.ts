import {
  credentials
} from 'grpc';

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

export default class EventResultService {

  private client: any;

  constructor() {
    const packageDefinition = loadProtoDescriptors();
    this.client = new packageDefinition.EventResultService('live-result-service:50051', credentials.createInsecure());
  }

  public eventResultChange(event: {
    eventId: string;
    localTeamResult: number;
    visitorTeamResult: number;
  }): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.client.EventResultChange({
        eventId: event.eventId,
        localTeamResult: event.localTeamResult,
        visitorTeamResult: event.visitorTeamResult
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