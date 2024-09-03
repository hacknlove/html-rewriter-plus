import { EventContext } from "@cloudflare/workers-types";
import { PostwareFunction, MiddlewareFunction } from "types";
export { setHeaders } from "./postwares/setHeaders";
export declare function onRequestFactory({ template, middlewares, data, clientSideData, postware, }: {
    template?: string | undefined;
    middlewares?: MiddlewareFunction[] | undefined;
    data?: {} | undefined;
    clientSideData?: {} | undefined;
    postware?: PostwareFunction[] | undefined;
}): (cfContext: EventContext<any, any, any>) => Promise<import("@cloudflare/workers-types").Response | Response>;
