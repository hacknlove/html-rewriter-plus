import { PostwareFunction, CommonResponse, RewriterContext } from "types";

export async function runPostwares(
  ctx: RewriterContext,
  inputResponse: CommonResponse,
  postwares: Array<PostwareFunction>,
) {
  let outputResponse = new Response(inputResponse.body, inputResponse);

  for (const postwareFunction of postwares) {
    outputResponse =
      (await postwareFunction(ctx, outputResponse)) || outputResponse;
  }
  return outputResponse;
}
