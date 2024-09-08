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

export function ssrTemplate(rewriter: HTMLRewriter, ctx: RewriterContext) {
  let html: string = "";
  rewriter.on("template[data-ssr-name]", {
    element(element) {
      const templateName = element.getAttribute("data-ssr-name") as string;
      ctx.skip = true;
      html = "";

      element.onEndTag(() => {
        ctx.skip = false;
        ctx.templates ??= {};
        ctx.templates[templateName] = html;
      });

      element.remove();
    },
    text(text) {
      html += text.text;
    },
    comments(comment) {
      html += `<!--${comment.text}-->`;
    },
  });

  rewriter.on("template[data-ssr-name] *", {
    element(element) {
      const tagName = element.tagName;
      html += `<${tagName}`;
      for (const [name, value] of element.attributes) {
        html += ` ${name}="${value}"`;
      }
      if (autoClose.includes(tagName)) {
        html += "/>";
      } else {
        html += ">";
        element.onEndTag(() => {
          html += `</${tagName}>`;
        });
      }
    },
  });
}
