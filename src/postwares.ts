import { EventContext } from "@cloudflare/workers-types";
import { PostwareFunction, CommonResponse, RewriterContext } from "types";

export async function runPostwares(
  cfContext: EventContext<any, any, any>,
  rewriterContext: RewriterContext,
  inputResponse: CommonResponse,
  postwares: Array<PostwareFunction>,
) {
  let outputResponse = new Response(inputResponse.body, inputResponse);

  for (const postwareFunction of postwares) {
    outputResponse =
      (await postwareFunction(cfContext, rewriterContext, outputResponse)) ||
      outputResponse;
  }
  return outputResponse;
}
