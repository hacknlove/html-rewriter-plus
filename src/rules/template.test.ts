import { ssrTemplate } from "./template";
import { HTMLRewriter } from "@/test/HTMLRewriter";
import { describe, it, expect } from "vitest";

describe("ssrTemplate", () => {
  it("should add the template to the rewriter context", async () => {
    const rewriter = new HTMLRewriter();
    const ctx = {
      templates: {},
    };

    ssrTemplate(rewriter, ctx);

    const result = await rewriter.transform(
      '<template data-ssr-name="template1"><div></div></template>',
    );

    expect(result).toBe("");

    expect(ctx.templates).toEqual({
      template1: "<div></div>",
    });
  });

  it("includes attributes in the template", async () => {
    const rewriter = new HTMLRewriter();
    const ctx = {
      templates: {},
    };

    ssrTemplate(rewriter, ctx);

    const result = await rewriter.transform(
      '<template data-ssr-name="template1"><div data-ssr-attr="value"></div></template>',
    );

    expect(result).toBe("");

    expect(ctx.templates).toEqual({
      template1: '<div data-ssr-attr="value"></div>',
    });
  });

  it("deals with auto-closing tags", async () => {
    const rewriter = new HTMLRewriter();
    const ctx = {
      templates: {},
    };

    ssrTemplate(rewriter, ctx);

    const result = await rewriter.transform(
      '<template data-ssr-name="template1"><img src="image.jpg" /></template>',
    );

    expect(result).toBe("");

    expect(ctx.templates).toEqual({
      template1: '<img src="image.jpg"/>',
    });
  });

  it('includes text content in the template', async () => {
    const rewriter = new HTMLRewriter();
    const ctx = {
      templates: {},
    };

    ssrTemplate(rewriter, ctx);

    const result = await rewriter.transform(
      '<template data-ssr-name="template1"><div>Hello, world!</div></template>',
    );

    expect(result).toBe("");

    expect(ctx.templates).toEqual({
      template1: "<div>Hello, world!</div>",
    });
  });

  it('includes comments in the template', async () => {
    const rewriter = new HTMLRewriter();
    const ctx = {
      templates: {},
    };

    ssrTemplate(rewriter, ctx);

    const result = await rewriter.transform(
      '<template data-ssr-name="template1"><div><!-- comment --></div></template>',
    );

    expect(result).toBe("");

    expect(ctx.templates).toEqual({
      template1: "<div><!-- comment --></div>",
    });
  });

  it('includes nested elements in the template', async () => {
    const rewriter = new HTMLRewriter();
    const ctx = {
      templates: {},
    };

    ssrTemplate(rewriter, ctx);

    const result = await rewriter.transform(
      '<template data-ssr-name="template1"><div><span></span></div></template>',
    );

    expect(result).toBe("");

    expect(ctx.templates).toEqual({
      template1: "<div><span></span></div>",
    });
  });

  it('includes text nodes in the root of the template', async () => {
    const rewriter = new HTMLRewriter();
    const ctx = {
      templates: {},
    };

    ssrTemplate(rewriter, ctx);

    const result = await rewriter.transform(
      '<template data-ssr-name="template1">Hello, world!<div></div></template>',
    );

    expect(result).toBe("");

    expect(ctx.templates).toEqual({
      template1: "Hello, world!<div></div>",
    });
  });
});
