"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ssrEnd = ssrEnd;
function ssrEnd(rewriter, rewriterContext) {
    rewriter.onDocument({
        async end(end) {
            try {
                await Promise.all(Object.values(rewriterContext.data));
            }
            catch (error) {
                console.error(error);
            }
            for (const [field, value] of Object.entries(rewriterContext.clientSideData)) {
                rewriterContext.clientSideData[field] = await value;
            }
            const code = "<script>window.data=" +
                JSON.stringify(rewriterContext.clientSideData) +
                ";document.dispatchEvent(new Event('on-data-loaded'))</script>";
            end.append(code, { html: true });
        },
    });
}
