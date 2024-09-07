"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ssrStyleCssVars = ssrStyleCssVars;
const resolve_1 = require("../resolve");
async function ssrStyleMapHeader(rewriterContext, vars, attributes) {
    let element = "<style ";
    for (const key in attributes) {
        element += `${key}="${attributes[key]}" `;
    }
    element += ">:root{";
    for (const [, field, key] of vars.matchAll(/([.\w]+):([^,]+)/g)) {
        const value = await (0, resolve_1.resolve)(rewriterContext.data, field);
        if (value === undefined) {
            attributes["data-ssr-error"] = `field ${field} not found in data`;
            continue;
        }
        element += "--" + key + ":" + value + ";";
    }
    return element + "}</style>";
}
function ssrStyleCssVars(rewriter, rewriterContext) {
    rewriter.on("ssr-style[data-ssr-css-vars]", {
        async element(element) {
            const vars = element.getAttribute("data-ssr-css-vars");
            element.removeAttribute("data-ssr-css-vars");
            if (rewriterContext.headElements) {
                rewriterContext.headElements.push(ssrStyleMapHeader(rewriterContext, vars, Object.fromEntries(element.attributes)));
                element.remove();
                return;
            }
            /*
             */
            let style = "";
            for (const [, field, attribute] of vars.matchAll(/([.\w]+):([^,]+)/g)) {
                const value = await (0, resolve_1.resolve)(rewriterContext.data, field);
                if (value === undefined) {
                    element.setAttribute("data-ssr-error", `field ${field} not found in data`);
                    continue;
                }
                style += `--${attribute}:${value};`;
            }
            element.after(`<style>:root{${style}}</style>`, { html: true });
            element.remove();
        },
    });
}