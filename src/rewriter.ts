import { HTMLRewriter } from "@cloudflare/workers-types";

import { rules } from "./rules";

export function rewriterFactory(data: any) {
  const rewriter = new HTMLRewriter();

  for (const rule of rules) {
    rule(rewriter, data);
  }

  return rewriter;
}
