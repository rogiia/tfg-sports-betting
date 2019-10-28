"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express = require("express");
const http_status_codes_1 = require("http-status-codes");
const persistence_1 = require("../persistence");
const router = express.Router();
router.post('/', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        const { eventId, localTeamResult, visitorTeamResult } = req.body;
        const event = {
            eventId,
            localTeamResult: parseInt(localTeamResult),
            visitorTeamResult: parseInt(visitorTeamResult)
        };
        const existingEvent = yield persistence_1.default.findEventByEventId(eventId);
        let result;
        if (existingEvent) {
            result = persistence_1.default.update(event);
        }
        else {
            result = persistence_1.default.create(event);
        }
        res.status(http_status_codes_1.OK).json(result);
    }
    catch (err) {
        console.error(err);
        res.status(http_status_codes_1.INTERNAL_SERVER_ERROR).json({ message: 'An unexpected error ocurred. Please contact with the system administrator and try again later.' });
    }
}));
exports.default = router;
