"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http_status_codes_1 = require("http-status-codes");
const router = express.Router();
router.get('/', (req, res, next) => {
    res.status(http_status_codes_1.OK).json([]);
});
exports.default = router;
