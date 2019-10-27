"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const AWS = require("aws-sdk");
const persistence_1 = require("../persistence");
AWS.config.update({ region: 'eu-west-1' });
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
const queueURL = process.env['SQS_URL'] || "https://sqs.eu-west-1.amazonaws.com/725226204633/tfg-queue";
const params = {
    AttributeNames: [
        "SentTimestamp"
    ],
    MessageAttributeNames: [
        "All"
    ],
    QueueUrl: queueURL,
    VisibilityTimeout: 20,
    WaitTimeSeconds: 0
};
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
        sqs.receiveMessage(params, (err, data) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (err) {
                console.log("QueueReceiver: Receive Error", err);
            }
            else if (data.Messages && data.Messages.length > 0) {
                for (const message of data.Messages) {
                    if (message.Body) {
                        const event = parseMessage(message.Body);
                        if (event) {
                            yield persistence_1.default.create(event);
                        }
                        if (message.ReceiptHandle) {
                            const deleteParams = {
                                QueueUrl: queueURL,
                                ReceiptHandle: message.ReceiptHandle
                            };
                            sqs.deleteMessage(deleteParams, (err, data) => {
                                if (err) {
                                    console.log("QueueReceiver: Delete Error", err);
                                }
                                else {
                                    console.log("QueueReceiver: Message Deleted", data);
                                }
                            });
                        }
                    }
                }
            }
        }));
    }
}
exports.default = QueueReceiver;
