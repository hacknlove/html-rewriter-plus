import { fullRules, smallRules } from "./index";
import { describe, test, expect } from "vitest";

describe("rules", () => {
  test("fullRules", () => {
    expect(fullRules).toHaveLength(8);
  });

  test("smallRules", () => {
    expect(smallRules).toHaveLength(4);
  });
});
