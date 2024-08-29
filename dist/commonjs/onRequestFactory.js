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
exports.onRequestFactory = onRequestFactory;
const afterwards_1 = require("./afterwards");
const isWebsocket_1 = require("./isWebsocket");
const rewriter_1 = require("./rewriter");
function onRequestFactory({ template = "", middlewares = [], afterwards = [], end = [], }) {
    return (cfContext) => __awaiter(this, void 0, void 0, function* () {
        if ((0, isWebsocket_1.isWebsocket)(cfContext)) {
            return cfContext.next();
        }
        const rewriterContext = {
            pageRequest: template
                ? cfContext.env.ASSETS.fetch(new URL(template, cfContext.request.url))
                : null,
            data: {},
            flags: {},
            clientSideData: {},
            end: end,
            template: template,
        };
        const rewriter = (0, rewriter_1.rewriterFactory)(rewriterContext);
        for (const middleware of middlewares) {
            yield middleware(cfContext, rewriterContext);
        }
        if (!rewriterContext.pageRequest) {
            rewriterContext.pageRequest = cfContext.env.ASSETS.fetch(new URL("/404", cfContext.request.url));
        }
        const transform = rewriter.transform((yield rewriterContext.pageRequest));
        if (afterwards.length) {
            return (0, afterwards_1.runAfterWards)(cfContext, transform, afterwards);
        }
        return transform;
    });
}
