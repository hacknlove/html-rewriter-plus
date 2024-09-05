"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ssrTemplate = ssrTemplate;
const autoClose = [
    "img",
    "input",
    "link",
    "br",
    "meta",
    "hr",
    "embed",
    "source",
    "area",
    "col",
    "base",
    "track",
    "param",
    "command",
    "keygen",
    "wbr",
];
function ssrTemplate(rewriter, rewriterContext) {
    let html = "";
    rewriter.on("template[data-ssr-template]", {
        element(element) {
            const templateName = element.getAttribute("data-ssr-template");
            html = "";
            element.onEndTag(() => {
                var _a;
                (_a = rewriterContext.templates) !== null && _a !== void 0 ? _a : (rewriterContext.templates = {});
                rewriterContext.templates[templateName] = html;
            });
        },
    });
    rewriter.on("template[data-ssr-template] *", {
        element(element) {
            html += `<${element.tagName}`;
            for (const [name, value] of element.attributes) {
                html += ` ${name}="${value}"`;
            }
            if (autoClose.includes(element.tagName)) {
                html += "/>";
            }
            else {
                html += ">";
                element.onEndTag(() => {
                    html += `</${element.tagName}>`;
                });
            }
        },
        text(text) {
            html += text.text;
        },
        comments(comment) {
            html += `<!--${comment.text}-->`;
        },
    });
}
