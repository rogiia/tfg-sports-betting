"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const eventSchema = new mongoose.Schema({
    sport: String,
    localTeam: String,
    visitorTeam: String,
    ended: Boolean
});
exports.default = mongoose.model('Event', eventSchema);
