import { describe, it, expect, vi } from "vitest";
import { onRequestFactory } from "./index";
import { HTMLRewriter } from "@/test/HTMLRewriter";
import { stubCfContext } from "./test/CfContext";

global.HTMLRewriter = vi.fn().mockImplementation(() => new HTMLRewriter());

describe("onRequestFactory", () => {
  it("should deal with websockets", async () => {
    const onRequest = onRequestFactory({});
    const cfContext = stubCfContext();
    cfContext.request.headers.set("Upgrade", "websocket");
    await onRequest(cfContext);
    await expect(cfContext.next).toHaveBeenCalled();
  });

  it("accepts all parameters and does not throw", async () => {
    const parameters = {
      template: "<div></div>",
      middlewares: [vi.fn()],
      data: {
        a: vi.fn(),
      },
      flags: {
        b: vi.fn(),
      },
      templates: {
        d: vi.fn(() => "<div></div>"),
      },
      clientSideData: {
        c: vi.fn(),
      },
      rules: [vi.fn()],
      postware: [vi.fn((ctx, response) => response)],
    };
    const onRequest = onRequestFactory(parameters);
    const cfContext = stubCfContext();
    const response = await onRequest(cfContext);
    expect(await response.text()).toBe(
      "<div></div><script>window.data={};document.dispatchEvent(new Event('on-data-loaded'))</script>",
    );
  });

  it("returns the response with no postwares", async () => {
    const parameters = {
      template: "<div></div>",
      middlewares: [vi.fn()],
      data: {
        a: vi.fn(),
      },
      flags: {
        b: vi.fn(),
      },
      templates: {
        d: vi.fn(() => "<div></div>"),
      },
      clientSideData: {
        c: vi.fn(),
      },
      rules: [vi.fn()],
    };
    const onRequest = onRequestFactory(parameters);
    const cfContext = stubCfContext();
    const response = await onRequest(cfContext);
    expect(await response.text()).toBe(
      "<div></div><script>window.data={};document.dispatchEvent(new Event('on-data-loaded'))</script>",
    );
  });

  it("returns from middleware", async () => {
    const parameters = {
      template: "<div></div>",
      middlewares: [vi.fn(() => new Response("hello"))],
    };
    const onRequest = onRequestFactory(parameters);
    const cfContext = stubCfContext();
    const response = await onRequest(cfContext);
    expect(await response.text()).toBe("hello");
  });
});
