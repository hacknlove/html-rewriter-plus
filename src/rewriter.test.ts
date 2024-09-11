import { rewriterFactory } from "./rewriter";
import { describe, it, expect, vi } from "vitest";
import { HTMLRewriter } from "@/test/HTMLRewriter";

global.HTMLRewriter = vi.fn().mockImplementation(() => new HTMLRewriter());

describe("rewriterFactory", () => {
  it("creates an HTMLRewriter instance with all the rules", () => {
    const ctx = { rules: [vi.fn(), vi.fn()] } as any;
    const rules = [vi.fn(), vi.fn()];
    const rewriter = rewriterFactory(ctx, rules);
    expect(rules[0]).toHaveBeenCalledWith(rewriter, ctx);
    expect(rules[1]).toHaveBeenCalledWith(rewriter, ctx);
    expect(ctx.rules[0]).toHaveBeenCalledWith(rewriter, ctx);
    expect(ctx.rules[1]).toHaveBeenCalledWith(rewriter, ctx);
    expect(rewriter).toBeInstanceOf(HTMLRewriter);
  });
});
