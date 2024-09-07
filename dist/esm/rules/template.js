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
    rewriter.on("template[data-ssr-name]", {
        element(element) {
            const templateName = element.getAttribute("data-ssr-name");
            rewriterContext.skip = true;
            html = "";
            element.onEndTag(() => {
                rewriterContext.skip = false;
                rewriterContext.templates ??= {};
                rewriterContext.templates[templateName] = html;
            });
            element.remove();
        },
    });
    rewriter.on("template[data-ssr-name] *", {
        element(element) {
            const tagName = element.tagName;
            html += `<${tagName}`;
            for (const [name, value] of element.attributes) {
                html += ` ${name}="${value}"`;
            }
            if (autoClose.includes(tagName)) {
                html += "/>";
            }
            else {
                html += ">";
                element.onEndTag(() => {
                    html += `</${tagName}>`;
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
