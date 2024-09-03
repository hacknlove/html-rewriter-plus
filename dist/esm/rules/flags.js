"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ssrFlags = ssrFlags;
function ssrFlags(rewriter, rewriterContext) {
    rewriter.on("body", {
        async element(element) {
            let bodyClass = element.getAttribute("class") ?? "";
            for (const key in rewriterContext.flags) {
                if (await rewriterContext.flags[key]) {
                    bodyClass += " " + key;
                }
            }
            element.setAttribute("class", bodyClass);
        },
    });
}
