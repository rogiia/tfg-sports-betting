import * as AWS from 'aws-sdk';
import { Consumer } from 'sqs-consumer';
import Persistence from '../persistence';
import EventResultService from '../grpc/event-result-service';
import BetService from '../grpc/bet-service';
AWS.config.update({region: 'eu-west-1'});

const eventResultSrv = new EventResultService();
const betSrv = new BetService();
const queueURL = process.env['SQS_URL'] || "https://sqs.eu-west-1.amazonaws.com/725226204633/tfg-queue";

function parseMessage(message: string): {
  sport: string;
  localTeam: string;
  visitorTeam: string;
  localTeamResult: string;
  visitorTeamResult: string;
  matchTime: string;
} | null {
  // Handle sport event message
  const eventMatches = message.match(/^(\w+) ([\d\w']+) (.+?) (\d+) - (\d+) (.+)$/);
  if (eventMatches && eventMatches.length === 7) {
    const [msg, sport, matchTime, localTeam, localTeamResult, visitorTeamResult, visitorTeam] = eventMatches;
    return {
      sport,
      localTeam,
      visitorTeam,
      localTeamResult,
      visitorTeamResult,
      matchTime
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
          console.log(`Received message: ${message.Body}`);
          const event = parseMessage(message.Body);
          if (event) {
            let eventId: string;
            console.log('Looking for already existing events');
            const currentEvent = await Persistence.findCurrentEventByTeams(event.localTeam, event.visitorTeam);
            if (event.matchTime === 'END') {
              if (currentEvent && currentEvent.length > 0) {
                eventId = currentEvent[0]._id;
                console.log(`Ending current event ${eventId}`);
                await Persistence.updateEventById(eventId, {
                  sport: event.sport,
                  localTeam: event.localTeam,
                  visitorTeam: event.visitorTeam,
                  ended: true
                });
                await betSrv.settleEndedEvent({
                  eventId,
                  result: event.localTeamResult > event.visitorTeamResult ? 'L' :
                    event.localTeamResult === event.visitorTeamResult ? 'D' : 'V'
                });
              }
            } else {
              if (currentEvent && currentEvent.length > 0) {
                console.log('Updating current event');
                await Persistence.updateEventById(currentEvent[0]._id, {
                  sport: event.sport,
                  localTeam: event.localTeam,
                  visitorTeam: event.visitorTeam,
                  ended: false
                });
                eventId = currentEvent[0]._id;
              } else {
                console.log('Creating new event');
                const newEvent = await Persistence.create({
                  sport: event.sport,
                  localTeam: event.localTeam,
                  visitorTeam: event.visitorTeam,
                  ended: false
                });
                eventId = newEvent._id;
              }
              eventResultSrv.eventResultChange({
                eventId: eventId,
                localTeamResult: parseInt(event.localTeamResult),
                visitorTeamResult: parseInt(event.visitorTeamResult)
              });
            }
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
