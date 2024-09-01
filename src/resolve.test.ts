import { describe, it, expect } from "vitest";

import { resolve } from "./resolve";

describe("resolve", () => {
  it("should return undefined if path is null", async () => {
    const result = await resolve({}, null);
    expect(result).toBe(undefined);
  });

  it("should return undefined if path is not found", async () => {
    const result = await resolve({}, "foo.bar");
    expect(result).toBe(undefined);
  });

  it("should return value if path is found", async () => {
    const result = await resolve({ foo: { bar: "baz" } }, "foo.bar");
    expect(result).toBe("baz");
  });
});
