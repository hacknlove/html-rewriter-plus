import { EventContext } from "@cloudflare/workers-types";
import {
  PostwareFunction,
  MiddlewareFunction,
  RewriterContext,
  CommonResponse,
} from "types";
import { runPostwares } from "./postwares";
import { isWebsocket } from "./isWebsocket";
import { rewriterFactory } from "./rewriter";

export { setHeaders } from "./postwares/setHeaders";

export function onRequestFactory({
  template = "",
  middlewares = [] as Array<MiddlewareFunction>,
  data = {} as Record<string, any>,
  clientSideData = {},
  postware = [] as Array<PostwareFunction>,
}) {
  return async (cfContext: EventContext<any, any, any>) => {
    if (isWebsocket(cfContext)) {
      return cfContext.next();
    }

    const rewriterContext: RewriterContext = {
      pageRequest: template
        ? cfContext.env.ASSETS.fetch(new URL(template, cfContext.request.url))
        : null,
      data: { ...data },
      flags: {},
      clientSideData,
      postware: postware,
      template: template,
    };

    for (const [field, value] of Object.entries(rewriterContext.data)) {
      if (typeof value === "function") {
        rewriterContext.data[field] = value(cfContext, rewriterContext);
      }
    }

    const rewriter = rewriterFactory(rewriterContext);

    for (const middleware of middlewares) {
      await middleware(cfContext, rewriterContext);
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
      return runPostwares(cfContext, transform, postware);
    }

    return transform;
  };
}
