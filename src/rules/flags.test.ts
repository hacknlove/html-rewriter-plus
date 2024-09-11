import { HTMLRewriterStrings } from "../test/HTMLRewriter";
import { RewriterContext } from "types.js";
import { describe, it, expect } from "vitest";
import { ssrFlags } from "./flags";

describe("ssrFlags", () => {
  it("should add flags as classes to the body element", async () => {
    const rewriter = new HTMLRewriterStrings();
    const ctx: RewriterContext = {
      flags: {
        flag1: true,
        flag2: false,
        flag3: true,
      },
    };

    ssrFlags(rewriter, ctx);

    const result = await rewriter.transform(
      '<body class="existing-class"></body>',
    );

    expect(result).toBe('<body class="existing-class flag1 flag3"></body>');
  });

  it("does not crash when class attribute is missing", async () => {
    const rewriter = new HTMLRewriterStrings();
    const ctx: RewriterContext = {
      flags: {
        flag1: true,
        flag2: false,
        flag3: true,
      },
    };

    ssrFlags(rewriter, ctx);

    const result = await rewriter.transform("<body></body>");

    expect(result).toBe('<body class=" flag1 flag3"></body>');
  });
});
