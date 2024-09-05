import { RewriterContext, Rule } from "types";

import { rules } from "./rules";

export function rewriterFactory(
  rewriterContext: RewriterContext,
  extraRules: Array<Rule> = [],
) {
  // @ts-expect-error: HTMLRewriter is available only in the Cloudflare environment
  const rewriter = new HTMLRewriter();

  for (const rule of rules) {
    rule(rewriter, rewriterContext);
  }

  for (const rule of extraRules) {
    rule(rewriter, rewriterContext);
  }

  return rewriter;
}
