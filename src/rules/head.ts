import { HTMLRewriter } from "@cloudflare/workers-types";
import { RewriterContext } from "types";

export function ssrHead(
  rewriter: HTMLRewriter,
  rewriterContext: RewriterContext,
) {
  rewriter.on("head", {
    element(element) {
      rewriterContext.headElements = [] as Array<Promise<string>>;

      element.onEndTag(async (endTag) => {
        const elements = await Promise.all(
          rewriterContext.headElements as Array<Promise<string>>,
        );
        for (const element of elements) {
          endTag.before(element, { html: true });
        }
        rewriterContext.headElements = null;
      });
    },
  });
}
