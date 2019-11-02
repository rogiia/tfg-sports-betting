"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express = require("express");
const http_status_codes_1 = require("http-status-codes");
const event_watcher_1 = require("../persistence/event-watcher");
const router = express.Router();
router.post('/', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        const { eventId, localTeamResult, visitorTeamResult } = req.body;
        const event = {
            eventId,
            localTeamResult: parseInt(localTeamResult),
            visitorTeamResult: parseInt(visitorTeamResult)
        };
        event_watcher_1.default.emit(event);
        res.status(http_status_codes_1.OK).json({ message: `Event ${eventId} published correctly` });
    }
    catch (err) {
        console.error(err);
        res.status(http_status_codes_1.INTERNAL_SERVER_ERROR).json({ message: 'An unexpected error ocurred. Please contact with the system administrator and try again later.' });
    }
}));
exports.default = router;
