"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setHeaders = void 0;
exports.onRequestFactory = onRequestFactory;
const postwares_1 = require("./postwares");
const isWebsocket_1 = require("./isWebsocket");
const rewriter_1 = require("./rewriter");
const rules_1 = require("./rules");
var setHeaders_1 = require("./postwares/setHeaders");
Object.defineProperty(exports, "setHeaders", { enumerable: true, get: function () { return setHeaders_1.setHeaders; } });
function onRequestFactory({ template = "", middlewares = [], data = {}, flags = {}, clientSideData = {}, postware = [], rules = [], templates = {}, }) {
    return async (cfContext) => {
        if ((0, isWebsocket_1.isWebsocket)(cfContext)) {
            return cfContext.next();
        }
        const originalTemplate = template;
        const rewriterContext = {
            pageRequest: template
                ? cfContext.env.ASSETS.fetch(new URL(template, cfContext.request.url))
                : null,
            data: { ...data },
            flags: { ...flags },
            clientSideData: { ...clientSideData },
            postware: postware,
            template: template,
            rules: [...rules],
            templates: { ...templates },
        };
        const rewriter = (0, rewriter_1.rewriterFactory)(rewriterContext, rules_1.fullRules);
        for (const middleware of middlewares) {
            const response = await middleware(cfContext, rewriterContext);
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
        const transform = rewriter.transform((await rewriterContext.pageRequest));
        if (postware.length) {
            return (0, postwares_1.runPostwares)(cfContext, rewriterContext, transform, postware);
        }
        return transform;
    };
}
