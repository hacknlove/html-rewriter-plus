"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setHeaders = void 0;
exports.onRequestFactory = onRequestFactory;
const postwares_1 = require("./postwares");
const isWebsocket_1 = require("./isWebsocket");
const rewriter_1 = require("./rewriter");
var setHeaders_1 = require("./postwares/setHeaders");
Object.defineProperty(exports, "setHeaders", { enumerable: true, get: function () { return setHeaders_1.setHeaders; } });
function onRequestFactory({ template = "", middlewares = [], data = {}, clientSideData = {}, postware = [], }) {
    return async (cfContext) => {
        if ((0, isWebsocket_1.isWebsocket)(cfContext)) {
            return cfContext.next();
        }
        const rewriterContext = {
            pageRequest: template
                ? cfContext.env.ASSETS.fetch(new URL(template, cfContext.request.url))
                : null,
            data,
            flags: {},
            clientSideData,
            postware: postware,
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
        if (postware.length) {
            return (0, postwares_1.runPostwares)(cfContext, transform, postware);
        }
        return transform;
    };
}
