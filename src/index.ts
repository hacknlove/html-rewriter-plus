import { EventContext } from "@cloudflare/workers-types";
import {
  PostwareFunction,
  MiddlewareFunction,
  RewriterContext,
  CommonResponse,
  Rule,
  Template,
} from "types";
import { runPostwares } from "./postwares";
import { isWebsocket } from "./isWebsocket";
import { rewriterFactory } from "./rewriter";
import { fullRules } from "./rules";
import { getTemplateAsResponse, getTemplateAsString } from "./getTemplate";

export { setHeaders } from "./postwares/setHeaders";

export function onRequestFactory({
  template = undefined as Template,
  middlewares = [] as Array<MiddlewareFunction>,
  data = {} as Record<string, any>,
  flags = {} as Record<string, any>,
  clientSideData = {},
  postware = [] as Array<PostwareFunction>,
  rules = [] as Array<Rule>,
  templates = {} as Record<string, Template>,
  any = {} as Record<string, any>,
}) {
  return async (cfContext: EventContext<any, any, any>) => {
    if (isWebsocket(cfContext)) {
      return cfContext.next();
    }

    const ctx: RewriterContext = {
      cfContext,
      pageRequest: null,
      data: { ...data },
      flags: { ...flags },
      clientSideData: { ...clientSideData },
      postware: postware,
      rules: [...rules],
      templates: { ...templates },
      any: { ...any },
    };

    ctx.pageRequest = getTemplateAsResponse(ctx, template);

    const rewriter = rewriterFactory(ctx, fullRules);

    for (const middleware of middlewares) {
      const response = await middleware(ctx);
      if (response) {
        return response;
      }
    }

    for (const [field, value] of Object.entries(ctx.data)) {
      if (typeof value === "function") {
        ctx.data[field] = value(ctx);
      }
    }

    for (const [field, value] of Object.entries(ctx.flags)) {
      if (typeof value === "function") {
        ctx.flags[field] = value(ctx);
      }
    }

    for (const [field, value] of Object.entries(ctx.templates)) {
      if (typeof value === "function") {
        ctx.templates[field] = getTemplateAsString(ctx, value);
      }
    }

    for (const [field, value] of Object.entries(ctx.clientSideData)) {
      if (typeof value === "function") {
        ctx.clientSideData[field] = value(ctx);
      }
    }

    const transform = rewriter.transform(
      (await ctx.pageRequest) as CommonResponse,
    ) as CommonResponse;

    if (postware.length) {
      return runPostwares(ctx, await transform, postware);
    }

    return transform;
  };
}
