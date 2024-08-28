"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolve = resolve;
async function resolve(data, path) {
    if (!path) {
        return undefined;
    }
    const segments = path.split(".");
    const first = segments.shift();
    let value = await data[first];
    for (const segment of segments) {
        value = value[segment];
        if (value === undefined) {
            return undefined;
        }
    }
    return value;
}
