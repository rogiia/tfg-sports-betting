"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const eventSchema = new mongoose.Schema({
    eventId: String,
    localTeamResult: Number,
    visitorTeamResult: Number
});
exports.default = mongoose.model('Event', eventSchema);
