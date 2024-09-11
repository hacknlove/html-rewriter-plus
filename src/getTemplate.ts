import { RewriterContext, Template } from "types.js";

export async function getTemplateAsResponse(
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

export async function getTemplateAsString(
  ctx: RewriterContext,
  template: Template,
): Promise<string> {
  let templateValue: string | null | Response | undefined;

  if (typeof template === "function") {
    templateValue = await template(ctx);
  } else if (typeof template !== "string") {
    templateValue = await template;
  } else {
    templateValue = template;
  }

  if (!templateValue) {
    return ctx.cfContext.env.ASSETS.fetch(ctx.cfContext.request.url).then(
      (response: Response) => response.text(),
    );
  }

  if (typeof templateValue !== "string") {
    return templateValue.text();
  }
  if (templateValue.match(/^\/$|^\/[^/]/)) {
    return ctx.cfContext.env.ASSETS.fetch(
      new URL(templateValue, ctx.cfContext.request.url),
    ).then((response: Response) => response.text());
  }

  if (templateValue.match(/^(https?:)?\/\//)) {
    return fetch(templateValue).then((response: Response) => response.text());
  }

  return templateValue;
}
