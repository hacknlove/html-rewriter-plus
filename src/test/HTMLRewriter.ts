/* From: https://github.com/cloudflare/html-rewriter-wasm/blob/c6b772fcfbd95b8f92ca6017ba609785da1efb2c/test/index.ts */

import { TextEncoder, TextDecoder } from "util";
import {
  DocumentHandlers,
  ElementHandlers,
  HTMLRewriter as RawHTMLRewriter,
  HTMLRewriterOptions as RawHTMLRewriterOptions,
} from "html-rewriter-wasm";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export class HTMLRewriter {
  private elementHandlers: [selector: string, handlers: ElementHandlers][] = [];
  private documentHandlers: DocumentHandlers[] = [];

  constructor(private readonly options?: RawHTMLRewriterOptions) {}

  on(selector: string, handlers: ElementHandlers): this {
    this.elementHandlers.push([selector, handlers]);
    return this;
  }

  onDocument(handlers: DocumentHandlers): this {
    this.documentHandlers.push(handlers);
    return this;
  }

  async transform(input: string): Promise<string> {
    let output = "";
    const rewriter = new RawHTMLRewriter((chunk) => {
      output += decoder.decode(chunk);
    }, this.options);
    for (const [selector, handlers] of this.elementHandlers) {
      rewriter.on(selector, handlers);
    }
    for (const handlers of this.documentHandlers) {
      rewriter.onDocument(handlers);
    }
    try {
      await rewriter.write(encoder.encode(input));
      await rewriter.end();
      return output;
    } finally {
      rewriter.free();
    }
  }
}
