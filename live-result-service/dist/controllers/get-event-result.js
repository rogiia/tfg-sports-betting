"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express = require("express");
const http_status_codes_1 = require("http-status-codes");
const event_watcher_1 = require("../persistence/event-watcher");
const STREAM_TIMEOUT = 3600000;
const router = express.Router();
router.get('/:event_id', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        const eventId = req.params['event_id'];
        res.status(http_status_codes_1.OK).set({
            connection: "keep-alive",
            "cache-control": "no-cache",
            "Content-Type": "text/event-stream"
        });
        const subscription = event_watcher_1.default.subscribe(eventId, (event) => {
            res.write(event);
        });
        if (subscription.event) {
            res.write(subscription.event);
        }
        else {
            res.status(http_status_codes_1.NOT_FOUND).json({ message: `Could not find event ${eventId}` });
        }
        if (subscription.unsubscribe) {
            setTimeout(subscription.unsubscribe, STREAM_TIMEOUT);
            res.end();
        }
    }
    catch (err) {
        console.error(err);
        res.status(http_status_codes_1.INTERNAL_SERVER_ERROR).json({ message: 'An unexpected error ocurred. Please contact with the system administrator and try again later.' });
    }
}));
exports.default = router;
