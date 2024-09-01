import {
  EventContext,
  Response as CFResponse,
} from "@cloudflare/workers-types";

export type PostwareFunction = (
  context: EventContext<any, any, any>,
  response: Response,
) => Promise<Response | void>;

export type MiddlewareFunction = (
  cfContext: EventContext<any, any, any>,
  rewriterContext: RewriterContext,
) => Promise<void>;

export type RewriterContext = {
  headElements?: Array<Promise<string>> | null;
  pageRequest: Promise<Response> | null;
  data: Record<string, any>;
  flags: Record<string, any>;
  clientSideData: Record<string, any>;
  postware: Array<PostwareFunction>;
  template: string;
};

export type CommonResponse = CFResponse & Response;

export {};
