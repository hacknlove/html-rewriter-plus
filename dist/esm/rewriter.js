"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rewriterFactory = rewriterFactory;
function rewriterFactory(rewriterContext, rules) {
    // @ts-expect-error: HTMLRewriter is available only in the Cloudflare environment
    const rewriter = new HTMLRewriter();
    for (const rule of rules) {
        rule(rewriter, rewriterContext);
    }
    for (const rule of rewriterContext.rules) {
        rule(rewriter, rewriterContext);
    }
    return rewriter;
}
