import { resolve } from "../resolve.js";
import { HTMLRewriter } from "@cloudflare/workers-types";
import { RewriterContext } from "types.js";

export function ssrIf(rewriter: HTMLRewriter, ctx: RewriterContext) {
  rewriter.on("[data-ssr-if]", {
    async element(element: any) {
      if (ctx.skip) {
        return;
      }
      const field = element.getAttribute("data-ssr-if");
      element.removeAttribute("data-ssr-if");

      const value = await resolve(ctx.data, field);

      if (!value) {
        element.remove();
      }
    },
  });
}
