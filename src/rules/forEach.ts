import { rewriterFactory } from "@/rewriter";
import { RewriterContext } from "types";
import { HTMLRewriter } from "@cloudflare/workers-types";
import { resolve } from "@/resolve";
import { smallRules } from ".";

export function ssrForEach(rewriter: HTMLRewriter, ctx: RewriterContext) {
  rewriter.on("template[data-ssr-for]", {
    async element(element) {
      if (ctx.skip) {
        return;
      }
      const key = element.getAttribute("data-ssr-for") as string;
      const field = element.getAttribute("data-ssr-in") as string;
      const templateName = element.getAttribute(
        "data-ssr-render-template",
      ) as string;

      const items = await resolve(ctx.data, field);

      const mainTemplate = await ctx.templates[templateName];

      for (const item of items) {
        if (!item) {
          continue;
        }
        const newRewriterContext = {
          ...ctx,
          data: { ...ctx.data, [key]: item },
        } as RewriterContext;

        const rewriter = rewriterFactory(newRewriterContext, smallRules);

        const template = (
          item.templateName
            ? await ctx.templates[item.templateName]
            : mainTemplate
        ) as string;

        const output = await rewriter.transform(new Response(template)).text();

        element.before(output, { html: true });
      }

      element.remove();
    },
  });
}
