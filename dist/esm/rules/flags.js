"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ssrFlags = ssrFlags;
function ssrFlags(rewriter, data) {
    rewriter.on("body", {
        element(element) {
            let bodyClass = element.getAttribute("class") ?? "";
            for (const key in data.flags) {
                if (data.flags[key]) {
                    bodyClass += " " + key;
                }
            }
            element.setAttribute("class", bodyClass);
        },
    });
}
