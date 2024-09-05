"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.smallRules = exports.fullRules = void 0;
const ssrMap_1 = require("./ssrMap");
const ssrStyleCssVars_1 = require("./ssrStyleCssVars");
const flags_1 = require("./flags");
const head_1 = require("./head");
const ssrEnd_1 = require("./ssrEnd");
const ssrIf_1 = require("./ssrIf");
const template_1 = require("./template");
const forEach_1 = require("./forEach");
exports.fullRules = [
    ssrMap_1.ssrMap,
    ssrStyleCssVars_1.ssrStyleCssVars,
    flags_1.ssrFlags,
    head_1.ssrHead,
    ssrEnd_1.ssrEnd,
    ssrIf_1.ssrIf,
    template_1.ssrTemplate,
    forEach_1.ssrForEach,
];
exports.smallRules = [ssrMap_1.ssrMap, ssrStyleCssVars_1.ssrStyleCssVars, ssrIf_1.ssrIf, template_1.ssrTemplate];
