"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ssrIf = ssrIf;
const resolve_1 = require("../resolve");
function ssrIf(rewriter, data) {
    rewriter.on("[data-ssr-if]", {
        async element(element) {
            const field = element.getAttribute("data-ssr-if");
            element.removeAttribute("data-ssr-if");
            const value = await (0, resolve_1.resolve)(data, field);
            if (!value) {
                element.remove();
            }
        },
    });
}
