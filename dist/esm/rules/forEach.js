"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ssrForEach = ssrForEach;
const rewriter_1 = require("@/rewriter");
const resolve_1 = require("@/resolve");
const _1 = require(".");
function ssrForEach(rewriter, rewriterContext) {
    rewriter.on("template[data-ssr-for-each]", {
        async element(element) {
            const key = element.getAttribute("data-ssr-for");
            const field = element.getAttribute("data-ssr-in");
            const template = element.getAttribute("data-ssr-render");
            const items = await (0, resolve_1.resolve)(rewriterContext.data, field);
            for (const item of items) {
                if (!item) {
                    continue;
                }
                const newRewriterContext = {
                    ...rewriterContext,
                    data: { ...rewriterContext.data, [key]: item },
                };
                const rewriter = (0, rewriter_1.rewriterFactory)(newRewriterContext, _1.smallRules);
                const templateHtml = rewriterContext.templates[item.template ?? template];
                const response = new Response(templateHtml);
                const output = await rewriter.transform(response).text();
                element.before(output, { html: true });
            }
            element.remove();
        },
    });
}
