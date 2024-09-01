import { HTMLRewriter } from "@/test/HTMLRewriter";
import { RewriterContext } from "types";
import { describe, it, expect } from "vitest";
import { ssrMap } from "./ssr-map";

describe("ssrMap", () => {
  it("should map data to attributes and innerHTML", async () => {
    const rewriter = new HTMLRewriter();
    const rewriterContext: RewriterContext = {
      data: {
        title: "Page Title",
        description: "Page Description",
      },
    };

    ssrMap(rewriter, rewriterContext);

    const result = await rewriter.transform(
      '<head><title data-ssr-map="title:innerText"></title><meta key="description" data-ssr-map="description:content"></head>',
    );

    expect(result).toBe(
      '<head><title>Page Title</title><meta key="description" content="Page Description"></head>',
    );
  });

  it("should add a data-ssr-error attribute if a field is not found", async () => {
    const rewriter = new HTMLRewriter();
    const rewriterContext: RewriterContext = {
      data: {},
    };

    ssrMap(rewriter, rewriterContext);

    const result = await rewriter.transform(
      '<head><title data-ssr-map="title:innerText"></title></head>',
    );

    expect(result).toBe(
      '<head><title data-ssr-error="field title not found in data"></title></head>',
    );
  });
});
