import { ssrForEach } from "./forEach";
import { describe, it, expect, vi } from "vitest";
import { HTMLRewriterStrings } from "@/test/HTMLRewriter";
import { Miniflare } from "miniflare";

describe("ssrForEach", () => {
  it("should render a template for each item in the array", async () => {
    const mf = new Miniflare({
      scriptPath: "./e2e/forEach.e2e.js",
    });

    const response = await mf.dispatchFetch("/");
    const body = await response.text();
    expect(body).toBe(`<div>Item 1</div><div>Item 2</div><div>Item 3</div>`);
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

    ssrForEach(rewriter, ctx);

    const result = await rewriter.transform(
      '<body><template data-ssr-for="item in items" data-ssr-render-template="item"></template></body>',
    );

    expect(result).toBe(
      '<body><template data-ssr-for="item in items" data-ssr-render-template="item"></template></body>',
    );
  });
});
