import { ssrForEach } from "./forEach";
import { describe, it, expect } from "vitest";
import { HTMLRewriterStrings } from "../test/HTMLRewriter";
import { ParsedHTMLRewriter } from "@worker-tools/parsed-html-rewriter"; // Every other test is using html-rewriter-wasm, but the forEach test is using parsed-html-rewriter. The reason is that html-rewriter-wasm is erroring on rewriter recursion. But it works fine with parsed-html-rewriter and more importantly in wrangler and in production. So, I'm using parsed-html-rewriter for this test. The rest will use html-rewriter-wasm, because it's faster and more similar to the actual Cloudflare Workers runtime.

global.HTMLRewriter = ParsedHTMLRewriter;

describe("ssrForEach", () => {
  it("should render a template for each item in the array", async () => {
    const rewriter = new ParsedHTMLRewriter();

    const ctx = {
      data: {
        items: [
          { title: "Item 1" },
          { title: "Item 2" },
          { title: "Item 3" },
          { title: "Item 4", templateName: "item2" },
          null,
        ],
      },
      templates: {
        item: '<div data-ssr-map="item.title:innerText"></div>',
        item2: '<span data-ssr-map="item.title:innerText"></span>',
      },
      rules: [],
    };

    // @ts-expect-error Testing purposes
    ssrForEach(rewriter, ctx);

    const result = await rewriter
      .transform(
        new Response(
          '<body><template data-ssr-for="item" data-ssr-in="items" data- data-ssr-render-template="item"></template></body>',
        ),
      )
      .text();

    expect(result).toBe(
      "<body><div>Item 1</div><div>Item 2</div><div>Item 3</div><span>Item 4</span></body>",
    );
  });

  it("should skip if ctx.skip is true", async () => {
    const rewriter = new HTMLRewriterStrings();
    const ctx = {
      data: {
        items: [{ title: "Item 1" }, { title: "Item 2" }, { title: "Item 3" }],
      },
      templates: {
        item: "<div>{title}</div>",
      },
      skip: true,
    };

    // @ts-expect-error Testing purposes
    ssrForEach(rewriter, ctx);

    const result = await rewriter.transform(
      '<body><template data-ssr-for="item in items" data-ssr-render-template="item"></template></body>',
    );

    expect(result).toBe(
      '<body><template data-ssr-for="item in items" data-ssr-render-template="item"></template></body>',
    );
  });
});
