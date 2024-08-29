import { HTMLRewriter } from "@cloudflare/workers-types";
import { RewriterContext } from "types";

import { rules } from "./rules";

export function rewriterFactory(rewriterContext: RewriterContext) {
  const rewriter = new HTMLRewriter();

  for (const rule of rules) {
    rule(rewriter, rewriterContext);
  }

  return rewriter;
}
