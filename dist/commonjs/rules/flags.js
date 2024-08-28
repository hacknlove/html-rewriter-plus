"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ssrFlags = ssrFlags;
function ssrFlags(rewriter, data) {
    rewriter.on("body", {
        element(element) {
            var _a;
            let bodyClass = (_a = element.getAttribute("class")) !== null && _a !== void 0 ? _a : "";
            for (const key in data.flags) {
                if (data.flags[key]) {
                    bodyClass += " " + key;
                }
            }
            element.setAttribute("class", bodyClass);
        },
    });
}
