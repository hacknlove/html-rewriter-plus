import { HTMLRewriterStrings } from "@/test/HTMLRewriter";
import { RewriterContext } from "types";
import { describe, it, expect } from "vitest";
import { ssrMap } from "./ssrMap";

describe("ssrMap", () => {
  it("should map data to attributes and innerHTML", async () => {
    const rewriter = new HTMLRewriterStrings();
    const ctx: RewriterContext = {
      data: {
        title: "Page Title",
        cover: "/cover.jpg",
      },
    };

    ssrMap(rewriter, ctx);

    const result = await rewriter.transform(
      '<body><h1 data-ssr-map="title:innerText"></h1><img data-ssr-map="cover:src" /></body>',
    );

    expect(result).toBe(
      '<body><h1>Page Title</h1><img src="/cover.jpg" /></body>',
    );
  });

  it("should add a data-ssr-error attribute if a field is not found", async () => {
    const rewriter = new HTMLRewriterStrings();
    const ctx: RewriterContext = {
      data: {},
    };

    ssrMap(rewriter, ctx);

    const result = await rewriter.transform(
      '<body><h1 data-ssr-map="title:innerText"></h1></body>',
    );

    expect(result).toBe(
      '<body><h1 data-ssr-error="field title not found in data"></h1></body>',
    );
  });

  it("skips elements if ctx.skip is true", async () => {
    const rewriter = new HTMLRewriterStrings();
    const ctx: RewriterContext = {
      data: {
        title: "Page Title",
      },
      skip: true,
    };

    ssrMap(rewriter, ctx);

    const result = await rewriter.transform(
      '<body><h1 data-ssr-map="title:innerText"></h1></body>',
    );

    expect(result).toBe(
      '<body><h1 data-ssr-map="title:innerText"></h1></body>',
    );
  });

  it('sets innerHTML if the attribute is "innerHTML"', async () => {
    const rewriter = new HTMLRewriterStrings();
    const ctx: RewriterContext = {
      data: {
        content: "<p>Page Content</p>",
      },
    };

    ssrMap(rewriter, ctx);

    const result = await rewriter.transform(
      '<div data-ssr-map="content:innerHTML"></div>',
    );

    expect(result).toBe("<div><p>Page Content</p></div>");
  });

  it("sets styles if the attribute is a style property", async () => {
    const rewriter = new HTMLRewriterStrings();
    const ctx: RewriterContext = {
      data: {
        color: "red",
      },
    };

    ssrMap(rewriter, ctx);

    const result = await rewriter.transform(
      '<div data-ssr-map="color:style.color"></div>',
    );

    expect(result).toBe('<div style="color:red;"></div>');
  });
});

describe("ssrMapHeader", () => {
  it("should map data to attributes and innerHTML", async () => {
    const rewriter = new HTMLRewriterStrings();
    const ctx: RewriterContext = {
      headElements: [],
      data: {
        title: "Page Title",
        description: "description",
      },
    };

    ssrMap(rewriter, ctx);

    const result = await rewriter.transform(
      '<head><title data-ssr-map="title:innerText"></title><meta key="description" data-ssr-map="description:content" /><meta key="last" /></head>',
    );

    expect(result).toBe('<head><meta key="last" /></head>');

    expect(await ctx.headElements[0]).toEqual("<title >Page Title</title>");
    expect(await ctx.headElements[1]).toEqual(
      '<meta key="description" content="description" />',
    );
  });

  it("should add a data-ssr-error attribute if a field is not found", async () => {
    const rewriter = new HTMLRewriterStrings();
    const ctx: RewriterContext = {
      headElements: [],
      data: {},
    };

    ssrMap(rewriter, ctx);

    const result = await rewriter.transform(
      '<head><title data-ssr-map="title:innerText"></title><meta key="description" data-ssr-map="description:content" /><meta key="last" /></head>',
    );

    expect(result).toBe('<head><meta key="last" /></head>');

    expect(await ctx.headElements[0]).toEqual(
      '<title data-ssr-error="field title not found in data" ></title>',
    );
    expect(await ctx.headElements[1]).toEqual(
      '<meta key="description" data-ssr-error="field description not found in data" />',
    );
  });

  it('sets innerHTML if the attribute is "innerHTML"', async () => {
    const rewriter = new HTMLRewriterStrings();
    const ctx: RewriterContext = {
      headElements: [],
      data: {
        title: "Page Title",
        description: "description",
      },
    };

    ssrMap(rewriter, ctx);

    const result = await rewriter.transform(
      '<head><title data-ssr-map="title:innerHTML"></title><meta key="last" /></head>',
    );

    expect(result).toBe('<head><meta key="last" /></head>');

    expect(await ctx.headElements[0]).toEqual("<title >Page Title</title>");
  });

  it("sets styles if the attribute is a style property", async () => {
    const rewriter = new HTMLRewriterStrings();
    const ctx: RewriterContext = {
      data: {
        color: "red",
      },
    };

    ssrMap(rewriter, ctx);

    const result = await rewriter.transform(
      '<div data-ssr-map="color:style.color"></div>',
    );

    expect(result).toBe('<div style="color:red;"></div>');
  });
});
