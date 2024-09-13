import { describe, it, expect } from "vitest";
import { prettify } from "htmlfy";

import { Miniflare } from "miniflare";

import { readdirSync } from "fs";
import { readFile } from "fs/promises";

const tests = readdirSync("./e2e/tests");

describe("end to end", () => {
  tests.forEach((test, index) => {
    it(test, async () => {
      const port = 18788 + index;
      const mf = new Miniflare({
        modules: true,
        modulesRules: [
          {
            type: "ESModule",
            include: ["**/*.js"],
          },
          { type: "Text", include: ["**/*.html"] },
        ],
        scriptPath: `./e2e/tests/${test}/server.js`,
        port,
        host: "localhost",
      });

      const [response, expected] = await Promise.all([
        mf.dispatchFetch(`http://localhost:${port}/`),
        readFile(`./e2e/tests/${test}/expected.html`, "utf-8"),
      ]);
      await mf.dispose();

      const body = prettify(await response.text());
      expect(body).toBe(expected);
    });
  });
});
