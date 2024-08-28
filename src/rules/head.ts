import { HTMLRewriter } from "@cloudflare/workers-types";

export function ssrHead(rewriter: HTMLRewriter, data: any) {
  rewriter.on("head", {
    element(element) {
      data.headElements = [];

      element.onEndTag(async (endTag) => {
        const elements = await Promise.all(data.headElements);
        for (const element of elements) {
          endTag.before(element, { html: true });
        }
        data.headElements = false;
      });
    },
  });
}
