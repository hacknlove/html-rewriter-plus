import { PostwareFunction, RewriterContext } from "types.js";

export async function runPostwares(
  ctx: RewriterContext,
  inputResponse: Response,
  postwares: Array<PostwareFunction>,
) {
  let outputResponse = inputResponse.clone();

  for (const postwareFunction of postwares) {
    outputResponse =
      (await postwareFunction(ctx, outputResponse)) || outputResponse;
  }
  return outputResponse;
}
