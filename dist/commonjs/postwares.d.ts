import { EventContext } from "@cloudflare/workers-types";
import { PostwareFunction, CommonResponse } from "types";
export declare function runPostwares(context: EventContext<any, any, any>, inputResponse: CommonResponse, postwares: Array<PostwareFunction>): Promise<Response>;
