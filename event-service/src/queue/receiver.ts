import * as AWS from 'aws-sdk';
import { Consumer } from 'sqs-consumer';
import Persistence from '../persistence';
import {
  IEvent
} from '../persistence/models/event.model';
AWS.config.update({region: 'eu-west-1'});

const queueURL = process.env['SQS_URL'] || "https://sqs.eu-west-1.amazonaws.com/725226204633/tfg-queue";

function parseMessage(message: string): IEvent | null {
  const matches = message.match(/^(\w+) (.+?) \d - \d (.+)$/);
  if (matches && matches.length === 4) {
    const sport = matches[1];
    const localTeam = matches[2];
    const visitorTeam = matches[3];
    return {
      sport,
      localTeam,
      visitorTeam
    };
  }
  return null;
}

export default class QueueReceiver {
  public static listen() {
    console.log('Connecting to SQS Queue...');

    const consumer = Consumer.create({
      queueUrl: queueURL,
      handleMessage: async (message) => {
        if (message.Body) {
          // Parse event from message
          const event = parseMessage(message.Body);
          if (event) {
            // Create new event from message
            await Persistence.create(event);
          }
        }
      }
    });
    consumer.on('error', (err) => {
      console.error(err.message);
    });
    consumer.on('processing_error', (err) => {
      console.error(err.message);
    });
    consumer.start();
  }
}
