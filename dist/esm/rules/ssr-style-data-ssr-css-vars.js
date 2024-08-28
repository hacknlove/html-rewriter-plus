"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ssrStyleDataSsrCssVars = ssrStyleDataSsrCssVars;
const resolve_1 = require("../resolve");
async function ssrStyleMapHeader(data, vars, attributes) {
    let element = "<style ";
    for (const key in attributes) {
        element += `${key}="${attributes[key]}" `;
    }
    element += ">:root{";
    for (const [, field, key] of vars.matchAll(/([.\w]+):([^,]+)/g)) {
        const value = await (0, resolve_1.resolve)(data.data, field);
        if (value === undefined) {
            attributes["data-ssr-error"] = `field ${field} not found in data`;
            continue;
        }
        element += "--" + key + ":" + value + ";";
    }
    return element + "}</style>";
}
function ssrStyleDataSsrCssVars(rewriter, data) {
    rewriter.on("ssr-style[data-ssr-css-vars]", {
        async element(element) {
            const vars = element.getAttribute("data-ssr-css-vars");
            if (data.headElements) {
                data.headElements.push(ssrStyleMapHeader(data, vars, Object.fromEntries(element.attributes)));
                element.remove();
                return;
            }
            /*
             */
            let style = "";
            for (const [, field, attribute] of vars.matchAll(/([.\w]+):([^,]+)/g)) {
                const value = await (0, resolve_1.resolve)(data.data, field);
                if (value === undefined) {
                    element.setAttribute("data-ssr-error", `field ${field} not found in data`);
                    continue;
                }
                style += `--${attribute}: ${value};`;
            }
            element.after(`<style>:root{${style}}</style>`, { html: true });
            element.remove();
        },
    });
}
