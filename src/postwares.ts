import { EventContext } from "@cloudflare/workers-types";
import { PostwareFunction, CommonResponse } from "types";

export async function runPostwares(
  context: EventContext<any, any, any>,
  inputResponse: CommonResponse,
  postwares: Array<PostwareFunction>,
) {
  let outputResponse = new Response(inputResponse.body, inputResponse);

  for (const postwareFunction of postwares) {
    outputResponse =
      (await postwareFunction(context, outputResponse)) || outputResponse;
  }
  return outputResponse;
}
