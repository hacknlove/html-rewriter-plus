import { HTMLRewriter } from "@/test/HTMLRewriter";
import { RewriterContext } from "types";
import { describe, it, expect } from "vitest";
import { ssrIf } from "./ssrIf";

describe("ssrIf", () => {
  it("should remove the element if the condition is false", async () => {
    const rewriter = new HTMLRewriter();
    const ctx: RewriterContext = {
      data: {
        foo: false,
      },
    };

    ssrIf(rewriter, ctx);

    const result = await rewriter.transform('<div data-ssr-if="foo">foo</div>');

    expect(result).toBe("");
  });
});
