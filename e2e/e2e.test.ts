import { describe, it, expect, afterAll } from "vitest";
import { prettify } from "htmlfy";

import { Miniflare, Log, LogLevel } from "miniflare";

import { readdirSync } from "fs";
import { readFile } from "fs/promises";

const tests = readdirSync("./e2e/tests");

let mfs: Array<Miniflare> = [];

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
        log: new Log(LogLevel.VERBOSE),
      });

      const [response, expected] = await Promise.all([
        mf.dispatchFetch(`http://localhost:${port}/`),
        readFile(`./e2e/tests/${test}/expected.html`, "utf-8"),
      ]);

      /*
        // this causes flakiness. Dispose will be done afterAll
        await mf.dispose();
      */

      const body = prettify(await response.text());
      expect(body).toBe(expected);
    });
  });
});

afterAll(async () => {
  await Promise.all(mfs.map((mf) => mf.dispose()));
});
