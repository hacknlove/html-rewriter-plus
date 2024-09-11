import { HTMLRewriter } from "@cloudflare/workers-types";
import { RewriterContext } from "types.js";

export function ssrEnd(rewriter: HTMLRewriter, ctx: RewriterContext) {
  rewriter.onDocument({
    async end(end) {
      for (const [field, value] of Object.entries(ctx.clientSideData)) {
        ctx.clientSideData[field] = await value;
      }

      const code =
        "<script>window.data=" +
        JSON.stringify(ctx.clientSideData) +
        ";document.dispatchEvent(new Event('on-data-loaded'))</script>";

      end.append(code, { html: true });
    },
  });
}
