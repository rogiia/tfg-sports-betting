import {
  Server,
  ServerCredentials,
  credentials
} from 'grpc';

import SettleBet from './implementation/bet-service';

function loadProtoDescriptors(protoFile: string) {
  const PROTO_PATH = `${__dirname}/protos/${protoFile}.proto`;
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

export class GRPCServer {

  private server: Server;

  constructor() {
    const GRPC_HOST = process.env['GRPC_HOST'] || '0.0.0.0';
    const GRPC_PORT = process.env['GRPC_PORT'] || 50051;
    this.server = new Server();
    const descriptors = loadProtoDescriptors('bet-service');
    this.server.addService(descriptors.BetService, {
      SettleBet
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

export class BalanceService {

  private client: any;

  constructor() {
    const packageDefinition = loadProtoDescriptors('balance-service');
    this.client = new packageDefinition.BalanceService('balance-service:50051', credentials.createInsecure());
  }

  public cashBet(params: {
    userId: string;
    prize: number;
  }): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.client.cashBet({
        userId: params.userId,
        prize: params.prize
      }, (err: Error, result: { OK: boolean }) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.OK);
        }
      });
    });
  }

  public payBet(params: {
    userId: string;
    amount: number;
  }): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.client.payBet({
        userId: params.userId,
        amount: params.amount
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