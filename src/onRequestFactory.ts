import { EventContext } from "@cloudflare/workers-types";
import {
  AfterwardFunction,
  MiddlewareFunction,
  RewriterContext,
  CommonResponse,
} from "types";
import { runAfterWards } from "./afterwards";
import { isWebsocket } from "./isWebsocket";
import { rewriterFactory } from "./rewriter";
export function onRequestFactory({
  template = "",
  middlewares = [] as Array<MiddlewareFunction>,
  afterwards = [] as Array<AfterwardFunction>,
  end = [],
}) {
  return async (cfContext: EventContext<any, any, any>) => {
    if (isWebsocket(cfContext)) {
      return cfContext.next();
    }

    const rewriterContext: RewriterContext = {
      pageRequest: template
        ? cfContext.env.ASSETS.fetch(new URL(template, cfContext.request.url))
        : null,
      data: {},
      flags: {},
      clientSideData: {},
      end: end,
      template: template,
    };

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

    if (afterwards.length) {
      return runAfterWards(cfContext, transform, afterwards);
    }

    return transform;
  };
}
