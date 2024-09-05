import { EventContext } from "@cloudflare/workers-types";
import { PostwareFunction, CommonResponse, RewriterContext } from "types";
export declare function runPostwares(cfContext: EventContext<any, any, any>, rewriterContext: RewriterContext, inputResponse: CommonResponse, postwares: Array<PostwareFunction>): Promise<Response>;
