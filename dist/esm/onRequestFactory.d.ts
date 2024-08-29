import { EventContext } from "@cloudflare/workers-types";
import { AfterwardFunction, MiddlewareFunction } from "types";
export declare function onRequestFactory({ template, middlewares, afterwards, end, }: {
    template?: string | undefined;
    middlewares?: MiddlewareFunction[] | undefined;
    afterwards?: AfterwardFunction[] | undefined;
    end?: never[] | undefined;
}): (cfContext: EventContext<any, any, any>) => Promise<import("@cloudflare/workers-types").Response | Response>;
