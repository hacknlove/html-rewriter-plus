import { rewriterFactory } from "@/rewriter";
import { RewriterContext } from "types";
import { HTMLRewriter } from "@cloudflare/workers-types";
import { resolve } from "@/resolve";
import { smallRules } from ".";

export function ssrForEach(
  rewriter: HTMLRewriter,
  rewriterContext: RewriterContext,
) {
  rewriter.on("template[data-ssr-for-each]", {
    async element(element) {
      const key = element.getAttribute("data-ssr-for") as string;
      const field = element.getAttribute("data-ssr-in") as string;
      const template = element.getAttribute("data-ssr-render") as string;

      const items = await resolve(rewriterContext.data, field);

      for (const item of items) {
        if (!item) {
          continue;
        }
        const newRewriterContext = {
          ...rewriterContext,
          data: { ...rewriterContext.data, [key]: item },
        } as RewriterContext;

        const rewriter = rewriterFactory(newRewriterContext, smallRules);

        const templateHtml =
          rewriterContext.templates[item.template ?? template];

        const response = new Response(templateHtml);

        const output = await rewriter.transform(response).text();

        element.before(output, { html: true });
      }

      element.remove();
    },
  });
}
