import { HTMLRewriter } from "@/test/HTMLRewriter";
import { RewriterContext } from "types";
import { describe, it, expect } from "vitest";
import { ssrStyleDataSsrCssVars } from "./ssr-style-data-ssr-css-vars";

describe("ssrStyleDataSsrCssVars", () => {
  it("should move the style element to the head", async () => {
    const rewriter = new HTMLRewriter();
    const rewriterContext: RewriterContext = {
      headElements: [],
      data: {
        color: {
          primary: "red",
        },
      },
    };

    ssrStyleDataSsrCssVars(rewriter, rewriterContext);

    const result = await rewriter.transform(
      '<head><ssr-style data-ssr-css-vars="color.primary:primary"></ssr-style></head>',
    );

    expect(result).toBe("<head></head>");

    const awaitedHeadElements = await Promise.all(rewriterContext.headElements);
    expect(awaitedHeadElements).toEqual([
      "<style >:root{--primary:red;}</style>",
    ]);
  });

  it("should add the variable to the style element", async () => {
    const rewriter = new HTMLRewriter();
    const rewriterContext: RewriterContext = {
      data: {
        color: {
          primary: "red",
        },
      },
    };

    ssrStyleDataSsrCssVars(rewriter, rewriterContext);

    const result = await rewriter.transform(
      '<ssr-style data-ssr-css-vars="color.primary:primary"></ssr-style>',
    );

    expect(result).toBe("<style>:root{--primary:red;}</style>");
  });
});
