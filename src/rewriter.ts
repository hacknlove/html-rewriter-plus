import { RewriterContext, Rule } from "types";

export function rewriterFactory(ctx: RewriterContext, rules: Array<Rule>) {
  // @ts-expect-error: HTMLRewriter is available only in the Cloudflare environment
  const rewriter = new HTMLRewriter();

  for (const rule of rules) {
    rule(rewriter, ctx);
  }

  for (const rule of ctx.rules) {
    rule(rewriter, ctx);
  }

  return rewriter;
}
