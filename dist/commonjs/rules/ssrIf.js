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
exports.ssrIf = ssrIf;
const resolve_1 = require("../resolve");
function ssrIf(rewriter, rewriterContext) {
    rewriter.on("[data-ssr-if]", {
        element(element) {
            return __awaiter(this, void 0, void 0, function* () {
                const field = element.getAttribute("data-ssr-if");
                element.removeAttribute("data-ssr-if");
                const value = yield (0, resolve_1.resolve)(rewriterContext.data, field);
                if (!value) {
                    element.remove();
                }
            });
        },
    });
}
