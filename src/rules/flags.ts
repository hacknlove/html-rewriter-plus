import { HTMLRewriter } from "@cloudflare/workers-types";
import { RewriterContext } from "types.js";

export function ssrFlags(rewriter: HTMLRewriter, ctx: RewriterContext) {
  rewriter.on("body", {
    async element(element: any) {
      let bodyClass = element.getAttribute("class") ?? "";
      for (const key in ctx.flags) {
        if (await ctx.flags[key]) {
          bodyClass += " " + key;
        }
      }

      element.setAttribute("class", bodyClass);
    },
  });
}
