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
exports.ssrForEach = ssrForEach;
const rewriter_1 = require("@/rewriter");
const resolve_1 = require("@/resolve");
const _1 = require(".");
function ssrForEach(rewriter, rewriterContext) {
    rewriter.on("template[data-ssr-for]", {
        element(element) {
            return __awaiter(this, void 0, void 0, function* () {
                var _a;
                if (rewriterContext.skip) {
                    return;
                }
                const key = element.getAttribute("data-ssr-for");
                const field = element.getAttribute("data-ssr-in");
                const template = element.getAttribute("data-ssr-render-template");
                const items = yield (0, resolve_1.resolve)(rewriterContext.data, field);
                for (const item of items) {
                    if (!item) {
                        continue;
                    }
                    const newRewriterContext = Object.assign(Object.assign({}, rewriterContext), { data: Object.assign(Object.assign({}, rewriterContext.data), { [key]: item }) });
                    const rewriter = (0, rewriter_1.rewriterFactory)(newRewriterContext, _1.smallRules);
                    const templateHtml = rewriterContext.templates[(_a = item.template) !== null && _a !== void 0 ? _a : template];
                    const response = new Response(templateHtml);
                    const output = yield rewriter.transform(response).text();
                    element.before(output, { html: true });
                }
                element.remove();
            });
        },
    });
}
