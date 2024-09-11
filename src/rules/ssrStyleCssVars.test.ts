import { HTMLRewriterStrings } from "../test/HTMLRewriter";
import { RewriterContext } from "types.js";
import { describe, it, expect } from "vitest";
import { ssrStyleCssVars } from "./ssrStyleCssVars";

describe("ssrStyleCssVars", () => {
  it("should move the style element to the end of head", async () => {
    const rewriter = new HTMLRewriterStrings();
    const ctx: RewriterContext = {
      headElements: [],
      data: {
        color: {
          primary: "red",
        },
      },
    };

    ssrStyleCssVars(rewriter, ctx);

    const result = await rewriter.transform(
      '<head><ssr-style data-ssr-css-vars="color.primary:primary"></ssr-style></head>',
    );

    expect(result).toBe("<head></head>");

    const awaitedHeadElements = await Promise.all(ctx.headElements);
    expect(awaitedHeadElements).toEqual([
      "<style>:root{--primary:red;}</style>",
    ]);
  });

  it("should add the variable to the style element", async () => {
    const rewriter = new HTMLRewriterStrings();
    const ctx: RewriterContext = {
      data: {
        color: {
          primary: "red",
        },
      },
    };

    ssrStyleCssVars(rewriter, ctx);

    const result = await rewriter.transform(
      '<ssr-style data-ssr-css-vars="color.primary:primary"></ssr-style>',
    );

    expect(result).toBe("<style>:root{--primary:red;}</style>");
  });

  it("skips if ctx.skip is true", async () => {
    const rewriter = new HTMLRewriterStrings();
    const ctx: RewriterContext = {
      data: {
        color: {
          primary: "red",
        },
      },
      skip: true,
    };

    ssrStyleCssVars(rewriter, ctx);

    const result = await rewriter.transform(
      '<ssr-style data-ssr-css-vars="color.primary:primary"></ssr-style>',
    );

    expect(result).toBe(
      '<ssr-style data-ssr-css-vars="color.primary:primary"></ssr-style>',
    );
  });

  it("adds a comment if the variable is not found", async () => {
    const rewriter = new HTMLRewriterStrings();
    const ctx: RewriterContext = {
      data: {},
    };

    ssrStyleCssVars(rewriter, ctx);

    const result = await rewriter.transform(
      '<ssr-style data-ssr-css-vars="color.primary:primary"></ssr-style>',
    );

    expect(result).toBe(
      "<style>:root{/* field color.primary not found in data */}</style>",
    );
  });
});
