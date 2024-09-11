import { runPostwares } from "./postwares";
import { describe, it, expect } from "vitest";

describe("runPostwares", () => {
  it("runs each postware function in order", async () => {
    const ctx = {} as any;
    const inputResponse = new Response("input response");
    const postwares = [
      async (ctx: any, response: Response) => {
        expect(await response.text()).toBe("input response");
        return new Response("first postware response");
      },
      async (ctx: any, response: Response) => {
        expect(await response.text()).toBe("first postware response");
        return new Response("second postware response");
      },
      async (ctx: any, response: Response) => {
        expect(await response.clone().text()).toBe("second postware response");
        return;
      },
    ];
    const outputResponse = await runPostwares(ctx, inputResponse, postwares);
    expect.assertions(4);
    expect(await outputResponse.text()).toBe("second postware response");
  });
});
