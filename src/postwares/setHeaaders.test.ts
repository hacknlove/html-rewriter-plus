import { EventContext } from "@cloudflare/workers-types";
import { describe, expect, it } from "vitest";

import { setHeaders } from "./setHeaders";

describe("setHeaders", () => {
  it("should set the specified header in the response", async () => {
    const key = "Content-Type";
    const value = "application/json";

    const response = new Response();
    const cfContext = {} as EventContext<any, any, any>;

    const rewriterContext = {} as any;

    const postware = setHeaders(key, value);
    await postware(cfContext, rewriterContext, response);

    expect(response.headers.get(key)).toBe(value);
  });
});
