import { isWebsocket } from "./isWebsocket";
import { describe, it, expect } from "vitest";

describe("isWebsocket", () => {
  it("returns true when the Upgrade header is websocket", () => {
    const context = {
      request: {
        headers: {
          get: (key: string) => (key === "Upgrade" ? "websocket" : undefined),
        },
      },
    } as any;
    expect(isWebsocket(context)).toBe(true);
  });

  it("returns false when the Upgrade header isn't websocket", () => {
    const context = {
      request: {
        headers: {
          get: (key: string) => (key === "Upgrade" ? "http" : undefined),
        },
      },
    } as any;
    expect(isWebsocket(context)).toBe(false);
  });
});
