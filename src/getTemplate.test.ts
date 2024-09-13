import { describe, it, expect, vi } from "vitest";
import { getTemplateAsResponse, getTemplateAsString } from "./getTemplate";
import { stubCfContext } from "./test/CfContext";

global.fetch = vi.fn((url) =>
  Promise.resolve(new Response(`the response from fetching ${url}`)),
);

describe("getTemplateAsResponse", () => {
  it("returns a response with the full template if passed", async () => {
    const template = "<div></div>";
    const pageRequest = await getTemplateAsResponse({}, template);
    expect(await pageRequest.text()).toBe(template);
  });

  it("fetches the template from internet if it is a URL", async () => {
    const template = "https://example.com";
    const pageRequest = await getTemplateAsResponse({}, template);
    expect(fetch).toHaveBeenCalledWith(template);
    expect(await pageRequest.text()).toBe(
      `the response from fetching ${template}`,
    );
  });

  it("fetches the template from the assets if it is a relative URL", async () => {
    const template = "/example";
    const cfContext = stubCfContext();
    cfContext.env.ASSETS.fetch.mockImplementationOnce(() =>
      Promise.resolve(
        new Response(`the response fetching ${template} from ASSETS`),
      ),
    );
    const pageRequest = await getTemplateAsResponse({ cfContext }, template);
    expect(await pageRequest.text()).toBe(
      `the response fetching /example from ASSETS`,
    );
  });

  it("evaluates the function if it is a function", async () => {
    const template = vi.fn(() => "<div></div>");
    const pageRequest = await getTemplateAsResponse({}, template);
    expect(await pageRequest.text()).toBe("<div></div>");
  });

  it("await the template if it is a promise", async () => {
    const template = Promise.resolve("<div></div>");
    const pageRequest = await getTemplateAsResponse({}, template);
    expect(await pageRequest.text()).toBe("<div></div>");
  });

  it("uses the path from the request if the template is falsy", async () => {
    const cfContext = stubCfContext();
    cfContext.env.ASSETS.fetch.mockImplementationOnce(() =>
      Promise.resolve(
        new Response(
          `the response fetching ${cfContext.request.url} from ASSETS`,
        ),
      ),
    );
    // @ts-expect-error should be an actual request
    cfContext.request = { url: "/some-path" };
    const pageRequest = await getTemplateAsResponse({ cfContext }, null);
    expect(await pageRequest.text()).toBe(
      `the response fetching ${cfContext.request.url} from ASSETS`,
    );
  });

  it("returns the template if it is a Response", async () => {
    const template = new Response("<div></div>");
    const pageRequest = await getTemplateAsResponse({}, template);
    expect(await pageRequest.text()).toBe("<div></div>");
  });
});

describe("getTemplateAsString", () => {
  it("returns a response with the full template if passed", async () => {
    const template = "<div></div>";
    const templateString = await getTemplateAsString({}, template);
    expect(await templateString).toBe(template);
  });

  it("fetches the template from internet if it is a URL", async () => {
    const template = "https://example.com";
    const templateString = await getTemplateAsString({}, template);
    expect(fetch).toHaveBeenCalledWith(template);
    expect(await templateString).toBe(`the response from fetching ${template}`);
  });

  it("fetches the template from the assets if it is a relative URL", async () => {
    const template = "/example";
    const cfContext = stubCfContext();
    cfContext.env.ASSETS.fetch.mockImplementationOnce(() =>
      Promise.resolve(
        new Response(`the response fetching ${template} from ASSETS`),
      ),
    );
    const templateString = await getTemplateAsString({ cfContext }, template);
    expect(await templateString).toBe(
      `the response fetching /example from ASSETS`,
    );
  });

  it("evaluates the function if it is a function", async () => {
    const template = vi.fn(() => "<div></div>");
    const templateString = await getTemplateAsString({}, template);
    expect(await templateString).toBe("<div></div>");
  });

  it("await the template if it is a promise", async () => {
    const template = Promise.resolve("<div></div>");
    const templateString = await getTemplateAsString({}, template);
    expect(await templateString).toBe("<div></div>");
  });

  it("uses the path from the request if the template is falsy", async () => {
    const cfContext = stubCfContext();
    cfContext.env.ASSETS.fetch.mockImplementationOnce(() =>
      Promise.resolve(
        new Response(
          `the response fetching ${cfContext.request.url} from ASSETS`,
        ),
      ),
    );
    // @ts-expect-error should be an actual request
    cfContext.request = { url: "/some-path" };
    const templateString = await getTemplateAsString({ cfContext }, null);
    expect(await templateString).toBe(
      `the response fetching ${cfContext.request.url} from ASSETS`,
    );
  });

  it("returns the template if it is a Response", async () => {
    const template = new Response("<div></div>");
    const templateString = await getTemplateAsString({}, template);
    expect(await templateString).toBe("<div></div>");
  });
});
