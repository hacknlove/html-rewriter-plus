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
exports.setHeaders = void 0;
exports.onRequestFactory = onRequestFactory;
const postwares_1 = require("./postwares");
const isWebsocket_1 = require("./isWebsocket");
const rewriter_1 = require("./rewriter");
var setHeaders_1 = require("./postwares/setHeaders");
Object.defineProperty(exports, "setHeaders", { enumerable: true, get: function () { return setHeaders_1.setHeaders; } });
function onRequestFactory({ template = "", middlewares = [], data = {}, flags = {}, clientSideData = {}, postware = [], }) {
    return (cfContext) => __awaiter(this, void 0, void 0, function* () {
        if ((0, isWebsocket_1.isWebsocket)(cfContext)) {
            return cfContext.next();
        }
        const originalTemplate = template;
        const rewriterContext = {
            pageRequest: template
                ? cfContext.env.ASSETS.fetch(new URL(template, cfContext.request.url))
                : null,
            data: Object.assign({}, data),
            flags: Object.assign({}, flags),
            clientSideData: Object.assign({}, clientSideData),
            postware: postware,
            template: template,
        };
        const rewriter = (0, rewriter_1.rewriterFactory)(rewriterContext);
        for (const middleware of middlewares) {
            const response = yield middleware(cfContext, rewriterContext);
            if (response) {
                return response;
            }
        }
        for (const [field, value] of Object.entries(rewriterContext.data)) {
            if (typeof value === "function") {
                rewriterContext.data[field] = value(cfContext, rewriterContext);
            }
        }
        for (const [field, value] of Object.entries(rewriterContext.flags)) {
            if (typeof value === "function") {
                rewriterContext.flags[field] = value(cfContext, rewriterContext);
            }
        }
        for (const [field, value] of Object.entries(rewriterContext.clientSideData)) {
            if (typeof value === "function") {
                rewriterContext.clientSideData[field] = value(cfContext, rewriterContext);
            }
        }
        if (rewriterContext.template !== originalTemplate) {
            rewriterContext.pageRequest = cfContext.env.ASSETS.fetch(new URL(rewriterContext.template, cfContext.request.url));
        }
        if (!rewriterContext.pageRequest) {
            rewriterContext.pageRequest = cfContext.env.ASSETS.fetch(new URL("/404", cfContext.request.url));
        }
        const transform = rewriter.transform((yield rewriterContext.pageRequest));
        if (postware.length) {
            return (0, postwares_1.runPostwares)(cfContext, rewriterContext, transform, postware);
        }
        return transform;
    });
}
