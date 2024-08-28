"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ssrStyleDataSsrCssVars = ssrStyleDataSsrCssVars;
const resolve_1 = require("../resolve");
function ssrStyleMapHeader(data, vars, attributes) {
    return __awaiter(this, void 0, void 0, function* () {
        let element = "<style ";
        for (const key in attributes) {
            element += `${key}="${attributes[key]}" `;
        }
        element += ">:root{";
        for (const [, field, key] of vars.matchAll(/([.\w]+):([^,]+)/g)) {
            const value = yield (0, resolve_1.resolve)(data.data, field);
            if (value === undefined) {
                attributes["data-ssr-error"] = `field ${field} not found in data`;
                continue;
            }
            element += "--" + key + ":" + value + ";";
        }
        return element + "}</style>";
    });
}
function ssrStyleDataSsrCssVars(rewriter, data) {
    rewriter.on("ssr-style[data-ssr-css-vars]", {
        element(element) {
            return __awaiter(this, void 0, void 0, function* () {
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
                    const value = yield (0, resolve_1.resolve)(data.data, field);
                    if (value === undefined) {
                        element.setAttribute("data-ssr-error", `field ${field} not found in data`);
                        continue;
                    }
                    style += `--${attribute}: ${value};`;
                }
                element.after(`<style>:root{${style}}</style>`, { html: true });
                element.remove();
            });
        },
    });
}
