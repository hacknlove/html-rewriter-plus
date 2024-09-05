import { HTMLRewriter } from "@cloudflare/workers-types";
import { resolve } from "@/resolve";
import { RewriterContext } from "types";

async function ssrMapHeader(
  rewriterContext: any,
  type: any,
  map: any,
  attributes: any,
) {
  let element = `<${type} `;
  let innerHTML = "";

  for (const [, field, attribute] of map.matchAll(/([.\w]+):([^,]+)/g)) {
    const value = await resolve(rewriterContext.data, field);
    if (value === undefined) {
      attributes["data-ssr-error"] = `field ${field} not found in data`;
      continue;
    }
    switch (attribute) {
      case "innerHTML":
        innerHTML = value;
        break;
      case "innerText":
        console.warn("innerText is not supported in head elements");
        innerHTML = value;
        break;
      default:
        attributes[attribute] = value;
    }
  }

  for (const key in attributes) {
    element += key + "=" + attributes[key] + " ";
  }

  return element + ">" + innerHTML + "</" + type + ">";
}

export function ssrMap(
  rewriter: HTMLRewriter,
  rewriterContext: RewriterContext,
) {
  rewriter.on("[data-ssr-map]", {
    async element(element) {
      const map = element.getAttribute("data-ssr-map") as string;
      element.removeAttribute("data-ssr-map");

      if (rewriterContext.headElements) {
        rewriterContext.headElements.push(
          ssrMapHeader(
            rewriterContext,
            element.tagName,
            map,
            Object.fromEntries(element.attributes),
          ),
        );
        element.remove();
        return;
      }

      let style = element.getAttribute("style") || "";

      for (const [, field, attribute] of map.matchAll(/([.\w]+):([^,]+)/g)) {
        const value = await resolve(rewriterContext.data, field);
        if (value === undefined) {
          element.setAttribute(
            "data-ssr-error",
            `field ${field} not found in data`,
          );
          continue;
        }
        switch (attribute) {
          case "innerHTML":
            element.setInnerContent(value, { html: true });
            break;
          case "innerText":
            element.setInnerContent(value);
            break;
          default:
            if (attribute.startsWith("style.")) {
              style += attribute.substring(6) + ":" + value + ";";
            } else {
              element.setAttribute(attribute, value);
            }
        }
      }
      if (style) {
        element.setAttribute("style", style);
      }
    },
  });
}
