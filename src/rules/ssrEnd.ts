import { HTMLRewriter } from "@cloudflare/workers-types";
import { RewriterContext } from "types";

export function ssrEnd(
  rewriter: HTMLRewriter,
  rewriterContext: RewriterContext,
) {
  rewriter.onDocument({
    async end(end) {
      try {
        await Promise.all(Object.values(rewriterContext.data));
      } catch (error) {
        console.error(error);
      }

      const code =
        "<script>window.data=" +
        JSON.stringify(rewriterContext.clientSideData) +
        ";document.dispatchEvent(new Event('on-data-loaded'))</script>";

      end.append(code, { html: true });
    },
  });
}