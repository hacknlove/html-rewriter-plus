import { HTMLRewriter } from "@cloudflare/workers-types";
import { resolve } from "../resolve";
import { RewriterContext } from "types";

async function elementToString(ctx: RewriterContext, vars: string) {
  let element = "<style>:root{";

  for (const [, field, key] of vars.matchAll(/([.\w]+):([^,]+)/g)) {
    const value = await resolve(ctx.data, field);
    if (value === undefined) {
      element += `/* field ${field} not found in data */`;
      continue;
    }
    element += "--" + key + ":" + value + ";";
  }

  return element + "}</style>";
}

export function ssrStyleCssVars(rewriter: HTMLRewriter, ctx: RewriterContext) {
  rewriter.on("ssr-style[data-ssr-css-vars]", {
    async element(element) {
      if (ctx.skip) {
        return;
      }
      const vars = element.getAttribute("data-ssr-css-vars") as string;
      const style = elementToString(ctx, vars);

      element.removeAttribute("data-ssr-css-vars");

      if (ctx.headElements) {
        ctx.headElements.push(style);
      } else {
        element.after(await style, { html: true });
      }
      element.remove();
    },
  });
}
