"use strict";
exports.__esModule = true;
var express = require("express");
var Server = /** @class */ (function () {
    function Server() {
        this.app = express();
    }
    Server.getServer = function () {
        if (!Server.instance) {
            Server.instance = new Server();
        }
        return Server.instance;
    };
    Server.prototype.start = function (port) {
        if (port === void 0) { port = 3000; }
        this.app.listen(port, function () { return console.log("Server listening on port " + port); });
    };
    Server.instance = null;
    return Server;
}());
exports["default"] = Server;
