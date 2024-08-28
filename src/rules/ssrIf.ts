import { resolve } from "../resolve";
import { HTMLRewriter } from "@cloudflare/workers-types";

export function ssrIf(rewriter: HTMLRewriter, data: any) {
  rewriter.on("[data-ssr-if]", {
    async element(element: any) {
      const field = element.getAttribute("data-ssr-if");
      element.removeAttribute("data-ssr-if");

      const value = await resolve(data, field);

      if (!value) {
        element.remove();
      }
    },
  });
}
