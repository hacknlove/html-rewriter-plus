import { HTMLRewriter } from "@cloudflare/workers-types";

export function ssrFlags(rewriter: HTMLRewriter, data: any) {
  rewriter.on("body", {
    element(element: any) {
      let bodyClass = element.getAttribute("class") ?? "";
      for (const key in data.flags) {
        if (data.flags[key]) {
          bodyClass += " " + key;
        }
      }

      element.setAttribute("class", bodyClass);
    },
  });
}
