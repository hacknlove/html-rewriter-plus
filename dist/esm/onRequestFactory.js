"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onRequestFactory = onRequestFactory;
const afterwards_1 = require("./afterwards");
const isWebsocket_1 = require("./isWebsocket");
const rewriter_1 = require("./rewriter");
function onRequestFactory({ template = "", middlewares = [], afterwards = [], end = [], }) {
    return async (cfContext) => {
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
            await middleware(cfContext, rewriterContext);
        }
        if (!rewriterContext.pageRequest) {
            rewriterContext.pageRequest = cfContext.env.ASSETS.fetch(new URL("/404", cfContext.request.url));
        }
        const transform = rewriter.transform((await rewriterContext.pageRequest));
        if (afterwards.length) {
            return (0, afterwards_1.runAfterWards)(cfContext, transform, afterwards);
        }
        return transform;
    };
}
