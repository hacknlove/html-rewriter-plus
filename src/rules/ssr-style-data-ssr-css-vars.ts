import { HTMLRewriter } from "@cloudflare/workers-types";
import { resolve } from "../resolve";

async function ssrStyleMapHeader(data: any, vars: any, attributes: any) {
  let element = "<style ";
  for (const key in attributes) {
    element += `${key}="${attributes[key]}" `;
  }

  element += ">:root{";

  for (const [, field, key] of vars.matchAll(/([.\w]+):([^,]+)/g)) {
    const value = await resolve(data.data, field);
    if (value === undefined) {
      attributes["data-ssr-error"] = `field ${field} not found in data`;
      continue;
    }
    element += "--" + key + ":" + value + ";";
  }

  return element + "}</style>";
}

export function ssrStyleDataSsrCssVars(rewriter: HTMLRewriter, data: any) {
  rewriter.on("ssr-style[data-ssr-css-vars]", {
    async element(element) {
      const vars = element.getAttribute("data-ssr-css-vars") as string;

      if (data.headElements) {
        data.headElements.push(
          ssrStyleMapHeader(data, vars, Object.fromEntries(element.attributes)),
        );

        element.remove();
        return;
      }
      /*
       */

      let style = "";

      for (const [, field, attribute] of vars.matchAll(/([.\w]+):([^,]+)/g)) {
        const value = await resolve(data.data, field);
        if (value === undefined) {
          element.setAttribute(
            "data-ssr-error",
            `field ${field} not found in data`,
          );
          continue;
        }
        style += `--${attribute}: ${value};`;
      }

      element.after(`<style>:root{${style}}</style>`, { html: true });

      element.remove();
    },
  });
}
