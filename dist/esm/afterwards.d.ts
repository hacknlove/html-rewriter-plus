import { EventContext } from "@cloudflare/workers-types";
import { AfterwardFunction, CommonResponse } from "types";
export declare function runAfterWards(context: EventContext<any, any, any>, inputResponse: CommonResponse, afterwards: Array<AfterwardFunction>): Promise<Response>;
