import { PostwareFunction } from "types.js";

export function setHeaders(key: string, value: string): PostwareFunction {
  return async (_, response: Response) => {
    response.headers.set(key, value);
    return response;
  };
}
