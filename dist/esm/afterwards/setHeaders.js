"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setHeaders = setHeaders;
function setHeaders(key, value) {
    return async (_, response) => {
        response.headers.set(key, value);
        return response;
    };
}
