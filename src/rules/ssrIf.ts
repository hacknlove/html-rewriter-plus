import { resolve } from "../resolve";
import { HTMLRewriter } from "@cloudflare/workers-types";
import { RewriterContext } from "types";

export function ssrIf(
  rewriter: HTMLRewriter,
  rewriterContext: RewriterContext,
) {
  rewriter.on("[data-ssr-if]", {
    async element(element: any) {
      const field = element.getAttribute("data-ssr-if");
      element.removeAttribute("data-ssr-if");

      const value = await resolve(rewriterContext.data, field);

      if (!value) {
        element.remove();
      }
    },
  });
}
