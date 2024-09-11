import type {
  IncomingRequestCfProperties,
  Request as CfRequest,
} from "@cloudflare/workers-types";

import { vi } from "vitest";

export function stubCfContext() {
  return {
    request: new Request("http://example.com") as unknown as CfRequest<
      unknown,
      IncomingRequestCfProperties<unknown>
    >,
    env: {
      ASSETS: {
        fetch: vi.fn(() => Promise.resolve(new Response(""))),
      },
    },
    functionPath: "/",
    waitUntil: vi.fn(),
    passThroughOnException: vi.fn(),
    next: vi.fn(),
    params: {},
    data: {},
  };
}
