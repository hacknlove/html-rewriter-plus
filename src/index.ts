import { EventContext } from "@cloudflare/workers-types";
import {
  PostwareFunction,
  MiddlewareFunction,
  RewriterContext,
  CommonResponse,
  Rule,
} from "types";
import { runPostwares } from "./postwares";
import { isWebsocket } from "./isWebsocket";
import { rewriterFactory } from "./rewriter";
import { fullRules } from "./rules";

export { setHeaders } from "./postwares/setHeaders";

export function onRequestFactory({
  template = "",
  middlewares = [] as Array<MiddlewareFunction>,
  data = {} as Record<string, any>,
  flags = {} as Record<string, any>,
  clientSideData = {},
  postware = [] as Array<PostwareFunction>,
  rules = [] as Array<Rule>,
  templates = {} as Record<string, string>,
}) {
  return async (cfContext: EventContext<any, any, any>) => {
    if (isWebsocket(cfContext)) {
      return cfContext.next();
    }

    const originalTemplate = template;

    const rewriterContext: RewriterContext = {
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

    const rewriter = rewriterFactory(rewriterContext, fullRules);

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

    for (const [field, value] of Object.entries(
      rewriterContext.clientSideData,
    )) {
      if (typeof value === "function") {
        rewriterContext.clientSideData[field] = value(
          cfContext,
          rewriterContext,
        );
      }
    }

    if (rewriterContext.template !== originalTemplate) {
      rewriterContext.pageRequest = cfContext.env.ASSETS.fetch(
        new URL(rewriterContext.template, cfContext.request.url),
      );
    }

    if (!rewriterContext.pageRequest) {
      rewriterContext.pageRequest = cfContext.env.ASSETS.fetch(
        new URL("/404", cfContext.request.url),
      );
    }

    const transform = rewriter.transform(
      (await rewriterContext.pageRequest) as CommonResponse,
    ) as CommonResponse;

    if (postware.length) {
      return runPostwares(cfContext, rewriterContext, transform, postware);
    }

    return transform;
  };
}
