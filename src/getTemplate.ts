import { RewriterContext, Template } from "types";

export async function getTemplate(
  ctx: RewriterContext,
  template: Template,
): Promise<Response> {
  let templateValue: string | null | Response | undefined;

  if (typeof template === "function") {
    templateValue = await template(ctx);
  } else if (typeof template !== "string") {
    templateValue = await template;
  } else {
    templateValue = template;
  }

  if (!templateValue) {
    return ctx.cfContext.env.ASSETS.fetch(ctx.cfContext.request.url);
  }

  if (typeof templateValue !== "string") {
    return templateValue;
  }
  if (templateValue.match(/^\/$|^\/[^/]/)) {
    return ctx.cfContext.env.ASSETS.fetch(
      new URL(templateValue, ctx.cfContext.request.url),
    );
  }

  if (templateValue.match(/^(https?:)?\/\//)) {
    return fetch(templateValue);
  }

  return new Response(templateValue);
}
