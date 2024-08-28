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
exports.ssrMap = ssrMap;
const resolve_1 = require("@/resolve");
function ssrMapHeader(data, type, map, attributes) {
    return __awaiter(this, void 0, void 0, function* () {
        let element = `<${type} `;
        let innerHTML = "";
        for (const [, field, attribute] of map.matchAll(/([.\w]+):([^,]+)/g)) {
            const value = yield (0, resolve_1.resolve)(data.data, field);
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
    });
}
function ssrMap(rewriter, data) {
    rewriter.on("[data-ssr-map]", {
        element(element) {
            return __awaiter(this, void 0, void 0, function* () {
                const map = element.getAttribute("data-ssr-map");
                element.removeAttribute("data-ssr-map");
                // onHead it deferred
                if (data.onHead) {
                    data.headElements.push(ssrMapHeader(data, element.tagName, map, Object.fromEntries(element.attributes)));
                    element.remove();
                    return;
                }
                for (const [, field, attribute] of map.matchAll(/([.\w]+):([^,]+)/g)) {
                    const value = yield (0, resolve_1.resolve)(data.data, field);
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
            });
        },
    });
}
