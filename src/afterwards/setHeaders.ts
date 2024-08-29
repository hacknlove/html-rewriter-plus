import { AfterwardFunction } from "types";

export function setHeaders(key: string, value: string): AfterwardFunction {
  return async (_, response: Response) => {
    response.headers.set(key, value);
    return response;
  };
}
