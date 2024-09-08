import { HTMLRewriter } from "@/test/HTMLRewriter";
import { RewriterContext } from "types";
import { describe, it, expect } from "vitest";
import { ssrHead } from "./head";

describe("ssrHead", () => {
  it("move some head elements to the end of the head", async () => {
    const rewriter = new HTMLRewriter();
    const ctx: RewriterContext = {};

    ssrHead(rewriter, ctx);

    rewriter.on("meta[key='move-this']", {
      element(element) {
        // it's responsability of any rule using this feature to add the element to the headElements array. Here we will just hardcode the string, for the sake of this test.
        ctx.headElements.push('<meta key="move-this" content="foo"/>');
        element.remove();
      },
    });

    const result = await rewriter.transform(
      '<head><title>Page Title</title><meta key="move-this" content="foo"/><link rel="stylesheet" href="styles.css"></head>',
    );

    expect(result).toBe(
      '<head><title>Page Title</title><link rel="stylesheet" href="styles.css"><meta key="move-this" content="foo"/></head>',
    );
  });
});
