import { HTMLRewriterStrings } from "@/test/HTMLRewriter";
import { RewriterContext } from "types";
import { describe, it, expect } from "vitest";
import { ssrIf } from "./ssrIf";

describe("ssrIf", () => {
  it("should remove the element if the condition is false", async () => {
    const rewriter = new HTMLRewriterStrings();
    const ctx: RewriterContext = {
      data: {
        foo: false,
      },
    };

    ssrIf(rewriter, ctx);

    const result = await rewriter.transform('<div data-ssr-if="foo">foo</div>');

    expect(result).toBe("");
  });

  it("should keep the element if the condition is true", async () => {
    const rewriter = new HTMLRewriterStrings();
    const ctx: RewriterContext = {
      data: {
        foo: true,
      },
    };

    ssrIf(rewriter, ctx);

    const result = await rewriter.transform('<div data-ssr-if="foo">foo</div>');

    expect(result).toBe("<div>foo</div>");
  });

  it("skips if ctx.skip is true", async () => {
    const rewriter = new HTMLRewriterStrings();
    const ctx: RewriterContext = {
      data: {
        foo: false,
      },
      skip: true,
    };

    ssrIf(rewriter, ctx);

    const result = await rewriter.transform('<div data-ssr-if="foo">foo</div>');

    expect(result).toBe('<div data-ssr-if="foo">foo</div>');
  });
});
