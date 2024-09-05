import { HTMLRewriter } from "@cloudflare/workers-types";
import { RewriterContext } from "types";

const autoClose = [
  "img",
  "input",
  "link",
  "br",
  "meta",
  "hr",
  "embed",
  "source",
  "area",
  "col",
  "base",
  "track",
  "param",
  "command",
  "keygen",
  "wbr",
];

export function ssrTemplate(
  rewriter: HTMLRewriter,
  rewriterContext: RewriterContext,
) {
  let html: string = "";
  rewriter.on("template[data-ssr-template]", {
    element(element) {
      const templateName = element.getAttribute("data-ssr-template") as string;
      html = "";

      element.onEndTag(() => {
        rewriterContext.templates ??= {};
        rewriterContext.templates[templateName] = html;
      });
    },
  });

  rewriter.on("template[data-ssr-template] *", {
    element(element) {
      html += `<${element.tagName}`;
      for (const [name, value] of element.attributes) {
        html += ` ${name}="${value}"`;
      }
      if (autoClose.includes(element.tagName)) {
        html += "/>";
      } else {
        html += ">";
        element.onEndTag(() => {
          html += `</${element.tagName}>`;
        });
      }
    },
    text(text) {
      html += text.text;
    },
    comments(comment) {
      html += `<!--${comment.text}-->`;
    },
  });
}
