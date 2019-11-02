"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const AWS = require("aws-sdk");
const sqs_consumer_1 = require("sqs-consumer");
const persistence_1 = require("../persistence");
const grpc_1 = require("../grpc");
AWS.config.update({ region: 'eu-west-1' });
const eventResultSrv = new grpc_1.default();
const queueURL = process.env['SQS_URL'] || "https://sqs.eu-west-1.amazonaws.com/725226204633/tfg-queue";
function parseMessage(message) {
    const eventMatches = message.match(/^(\w+) ([\d\w']+) (.+?) (\d+) - (\d+) (.+)$/);
    if (eventMatches && eventMatches.length === 6) {
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
class QueueReceiver {
    static listen() {
        console.log('Connecting to SQS Queue...');
        const consumer = sqs_consumer_1.Consumer.create({
            queueUrl: queueURL,
            handleMessage: (message) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                if (message.Body) {
                    const event = parseMessage(message.Body);
                    if (event) {
                        let eventId;
                        const currentEvent = yield persistence_1.default.findCurrentEventByTeams(event.localTeam, event.visitorTeam);
                        if (event.matchTime === 'END') {
                            if (currentEvent && currentEvent.length > 0) {
                                yield persistence_1.default.updateEventById(currentEvent[0]._id, {
                                    sport: event.sport,
                                    localTeam: event.localTeam,
                                    visitorTeam: event.visitorTeam,
                                    ended: true
                                });
                                eventId = currentEvent[0]._id;
                            }
                        }
                        else {
                            if (currentEvent && currentEvent.length > 0) {
                                yield persistence_1.default.updateEventById(currentEvent[0]._id, {
                                    sport: event.sport,
                                    localTeam: event.localTeam,
                                    visitorTeam: event.visitorTeam,
                                    ended: false
                                });
                                eventId = currentEvent[0]._id;
                            }
                            else {
                                const newEvent = yield persistence_1.default.create({
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
            })
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
exports.default = QueueReceiver;
