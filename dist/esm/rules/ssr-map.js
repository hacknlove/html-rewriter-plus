"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ssrMap = ssrMap;
const resolve_1 = require("@/resolve");
async function ssrMapHeader(rewriterContext, type, map, attributes) {
    let element = `<${type} `;
    let innerHTML = "";
    for (const [, field, attribute] of map.matchAll(/([.\w]+):([^,]+)/g)) {
        const value = await (0, resolve_1.resolve)(rewriterContext.data, field);
        if (value === undefined) {
            attributes["data-ssr-error"] = `field ${field} not found in data`;
            continue;
        }
        switch (attribute) {
            case "innerHTML":
                innerHTML = value;
                break;
            case "innerText":
                console.warn("innerText is not supported in head elements");
                innerHTML = value;
                break;
            default:
                attributes[attribute] = value;
        }
    }
    for (const key in attributes) {
        element += key + "=" + attributes[key] + " ";
    }
    return element + ">" + innerHTML + "</" + type + ">";
}
function ssrMap(rewriter, rewriterContext) {
    rewriter.on("[data-ssr-map]", {
        async element(element) {
            const map = element.getAttribute("data-ssr-map");
            element.removeAttribute("data-ssr-map");
            if (rewriterContext.headElements) {
                rewriterContext.headElements.push(ssrMapHeader(rewriterContext, element.tagName, map, Object.fromEntries(element.attributes)));
                element.remove();
                return;
            }
            for (const [, field, attribute] of map.matchAll(/([.\w]+):([^,]+)/g)) {
                const value = await (0, resolve_1.resolve)(rewriterContext.data, field);
                if (value === undefined) {
                    element.setAttribute("data-ssr-error", `field ${field} not found in data`);
                    continue;
                }
                switch (attribute) {
                    case "innerHTML":
                        element.setInnerContent(value, { html: true });
                        break;
                    case "innerText":
                        element.setInnerContent(value);
                        break;
                    default:
                        element.setAttribute(attribute, value);
                }
            }
        },
    });
}
