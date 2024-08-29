"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rewriterFactory = rewriterFactory;
const workers_types_1 = require("@cloudflare/workers-types");
const rules_1 = require("./rules");
function rewriterFactory(rewriterContext) {
    const rewriter = new workers_types_1.HTMLRewriter();
    for (const rule of rules_1.rules) {
        rule(rewriter, rewriterContext);
    }
    return rewriter;
}
