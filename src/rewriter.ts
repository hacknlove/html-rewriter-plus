import { RewriterContext } from "types";

import { rules } from "./rules";

export function rewriterFactory(rewriterContext: RewriterContext) {
  // @ts-expect-error: HTMLRewriter is available only in the Cloudflare environment
  const rewriter = new HTMLRewriter();

  for (const rule of rules) {
    rule(rewriter, rewriterContext);
  }

  return rewriter;
}
