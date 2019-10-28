"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const AWS = require("aws-sdk");
const sqs_consumer_1 = require("sqs-consumer");
const persistence_1 = require("../persistence");
AWS.config.update({ region: 'eu-west-1' });
const queueURL = process.env['SQS_URL'] || "https://sqs.eu-west-1.amazonaws.com/725226204633/tfg-queue";
function parseMessage(message) {
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
class QueueReceiver {
    static listen() {
        console.log('Connecting to SQS Queue...');
        const consumer = sqs_consumer_1.Consumer.create({
            queueUrl: queueURL,
            handleMessage: (message) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                if (message.Body) {
                    const event = parseMessage(message.Body);
                    if (event) {
                        yield persistence_1.default.create(event);
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
