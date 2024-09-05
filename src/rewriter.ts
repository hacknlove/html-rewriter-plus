import { RewriterContext, Rule } from "types";

export function rewriterFactory(
  rewriterContext: RewriterContext,
  rules: Array<Rule>,
) {
  // @ts-expect-error: HTMLRewriter is available only in the Cloudflare environment
  const rewriter = new HTMLRewriter();

  for (const rule of rules) {
    rule(rewriter, rewriterContext);
  }

  for (const rule of rewriterContext.rules) {
    rule(rewriter, rewriterContext);
  }

  return rewriter;
}
