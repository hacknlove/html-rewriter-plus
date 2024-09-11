import { ssrForEach } from "./forEach";
import { describe, it, expect } from "vitest";
import { HTMLRewriterStrings } from "../test/HTMLRewriter";
import { Miniflare } from "miniflare";

describe("ssrForEach", () => {
  it("should render a template for each item in the array", async () => {
    const mf = new Miniflare({
      modules: true,
      modulesRules: [
        {
          type: "ESModule",
          include: ["**/*.js"],
        },
      ],
      scriptPath: "./e2e/forEach.e2e.mjs",
      port: 8788,
      host: "localhost",
    });

    const response = await mf.dispatchFetch("http://localhost:8788/");
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
