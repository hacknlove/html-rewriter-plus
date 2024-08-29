"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ssrHead = ssrHead;
function ssrHead(rewriter, rewriterContext) {
    rewriter.on("head", {
        element(element) {
            rewriterContext.headElements = [];
            element.onEndTag(async (endTag) => {
                const elements = await Promise.all(rewriterContext.headElements);
                for (const element of elements) {
                    endTag.before(element, { html: true });
                }
                rewriterContext.headElements = null;
            });
        },
    });
}
