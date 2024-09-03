"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rules = void 0;
const ssrMap_1 = require("./ssrMap");
const ssrStyleCssVars_1 = require("./ssrStyleCssVars");
const flags_1 = require("./flags");
const head_1 = require("./head");
const ssrEnd_1 = require("./ssrEnd");
const ssrIf_1 = require("./ssrIf");
exports.rules = [
    ssrMap_1.ssrMap,
    ssrStyleCssVars_1.ssrStyleCssVars,
    flags_1.ssrFlags,
    head_1.ssrHead,
    ssrEnd_1.ssrEnd,
    ssrIf_1.ssrIf,
];
