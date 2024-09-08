import { HTMLRewriter } from "@cloudflare/workers-types";
import { resolve } from "../resolve";
import { RewriterContext } from "types";

async function ssrStyleMapHeader(
  ctx: RewriterContext,
  vars: string,
  attributes: Record<string, string>,
) {
  let element = "<style ";
  for (const key in attributes) {
    element += `${key}="${attributes[key]}" `;
  }

  element += ">:root{";

  for (const [, field, key] of vars.matchAll(/([.\w]+):([^,]+)/g)) {
    const value = await resolve(ctx.data, field);
    if (value === undefined) {
      attributes["data-ssr-error"] = `field ${field} not found in data`;
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

      element.removeAttribute("data-ssr-css-vars");

      if (ctx.headElements) {
        ctx.headElements.push(
          ssrStyleMapHeader(ctx, vars, Object.fromEntries(element.attributes)),
        );

        element.remove();
        return;
      }
      /*
       */

      let style = "";

      for (const [, field, attribute] of vars.matchAll(/([.\w]+):([^,]+)/g)) {
        const value = await resolve(ctx.data, field);
        if (value === undefined) {
          element.setAttribute(
            "data-ssr-error",
            `field ${field} not found in data`,
          );
          continue;
        }
        style += `--${attribute}:${value};`;
      }

      element.after(`<style>:root{${style}}</style>`, { html: true });

      element.remove();
    },
  });
}
