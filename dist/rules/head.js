"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ssrHead = ssrHead;
function ssrHead(rewriter, data) {
    rewriter.on("head", {
        element(element) {
            data.headElements = [];
            element.onEndTag(async (endTag) => {
                const elements = await Promise.all(data.headElements);
                for (const element of elements) {
                    endTag.before(element, { html: true });
                }
                data.headElements = false;
            });
        },
    });
}
