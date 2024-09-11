import { PostwareFunction, RewriterContext } from "types";

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
