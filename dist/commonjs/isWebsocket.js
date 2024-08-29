"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isWebsocket = isWebsocket;
function isWebsocket(context) {
    return context.request.headers.get("Upgrade") === "websocket";
}
