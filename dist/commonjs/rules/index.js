"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rules = void 0;
const ssr_map_1 = require("./ssr-map");
const ssr_style_data_ssr_css_vars_1 = require("./ssr-style-data-ssr-css-vars");
const flags_1 = require("./flags");
const head_1 = require("./head");
const ssrEnd_1 = require("./ssrEnd");
const ssrIf_1 = require("./ssrIf");
exports.rules = [
    ssr_map_1.ssrMap,
    ssr_style_data_ssr_css_vars_1.ssrStyleDataSsrCssVars,
    flags_1.ssrFlags,
    head_1.ssrHead,
    ssrEnd_1.ssrEnd,
    ssrIf_1.ssrIf,
];
