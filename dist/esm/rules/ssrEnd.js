"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ssrEnd = ssrEnd;
function ssrEnd(rewriter, data) {
    rewriter.onDocument({
        async end(end) {
            try {
                await Promise.all(Object.values(data.data));
            }
            catch (error) {
                console.error(error);
            }
            const code = "<script>window.data=" +
                JSON.stringify(data.clientSideData) +
                ";document.dispatchEvent(new Event('on-data-loaded'))</script>";
            end.append(code, { html: true });
        },
    });
}
