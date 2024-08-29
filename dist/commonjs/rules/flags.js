"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ssrFlags = ssrFlags;
function ssrFlags(rewriter, rewriterContext) {
    rewriter.on("body", {
        element(element) {
            var _a;
            let bodyClass = (_a = element.getAttribute("class")) !== null && _a !== void 0 ? _a : "";
            for (const key in rewriterContext.flags) {
                if (rewriterContext.flags[key]) {
                    bodyClass += " " + key;
                }
            }
            element.setAttribute("class", bodyClass);
        },
    });
}
