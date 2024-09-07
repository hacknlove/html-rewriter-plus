import { ssrTemplate } from "./template";
import { HTMLRewriter } from "@/test/HTMLRewriter";
import { describe, it, expect } from "vitest";

describe("ssrTemplate", () => {
  it("should add the template to the rewriter context", async () => {
    const rewriter = new HTMLRewriter();
    const rewriterContext = {
      templates: {},
    };

    ssrTemplate(rewriter, rewriterContext);

    const result = await rewriter.transform(
      '<template data-ssr-name="template1"><div></div></template>',
    );

    expect(result).toBe("");

    expect(rewriterContext.templates).toEqual({
      template1: "<div></div>",
    });
  });
});
