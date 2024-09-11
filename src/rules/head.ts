import { HTMLRewriter } from "@cloudflare/workers-types";
import { RewriterContext } from "types.js";

export function ssrHead(rewriter: HTMLRewriter, ctx: RewriterContext) {
  rewriter.on("head", {
    element(element) {
      ctx.headElements = [] as Array<Promise<string>>;

      element.onEndTag(async (endTag) => {
        const elements = await Promise.all(
          ctx.headElements as Array<Promise<string>>,
        );
        for (const element of elements) {
          endTag.before(element, { html: true });
        }
        ctx.headElements = null;
      });
    },
  });
}
