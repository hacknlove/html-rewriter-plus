import { PostwareFunction } from "types";

export function setHeaders(key: string, value: string): PostwareFunction {
  return async (_, __, response: Response) => {
    response.headers.set(key, value);
    return response;
  };
}
