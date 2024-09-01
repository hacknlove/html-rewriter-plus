import { HTMLRewriter } from "@/test/HTMLRewriter";
import { RewriterContext } from "types";
import { describe, it, expect } from "vitest";
import { ssrFlags } from "./flags";

describe("ssrFlags", () => {
  it("should add flags as classes to the body element", async () => {
    const rewriter = new HTMLRewriter();
    const rewriterContext: RewriterContext = {
      flags: {
        flag1: true,
        flag2: false,
        flag3: true,
      },
    };

    ssrFlags(rewriter, rewriterContext);

    const result = await rewriter.transform(
      '<body class="existing-class"></body>',
    );

    expect(result).toBe('<body class="existing-class flag1 flag3"></body>');
  });
});
