import { EventContext } from "@cloudflare/workers-types";
import { AfterwardFunction, CommonResponse } from "types";

export async function runAfterWards(
  context: EventContext<any, any, any>,
  inputResponse: CommonResponse,
  afterwards: Array<AfterwardFunction>,
) {
  let outputResponse = new Response(inputResponse.body, inputResponse);

  for (const afterwardFunction of afterwards) {
    outputResponse =
      (await afterwardFunction(context, outputResponse)) || outputResponse;
  }
  return outputResponse;
}
