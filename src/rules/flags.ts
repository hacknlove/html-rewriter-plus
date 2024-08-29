import { HTMLRewriter } from "@cloudflare/workers-types";
import { RewriterContext } from "types";

export function ssrFlags(
  rewriter: HTMLRewriter,
  rewriterContext: RewriterContext,
) {
  rewriter.on("body", {
    element(element: any) {
      let bodyClass = element.getAttribute("class") ?? "";
      for (const key in rewriterContext.flags) {
        if (rewriterContext.flags[key]) {
          bodyClass += " " + key;
        }
      }

      element.setAttribute("class", bodyClass);
    },
  });
}
