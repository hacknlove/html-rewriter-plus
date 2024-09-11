import {
  EventContext,
  Response as CFResponse,
} from "@cloudflare/workers-types";

export type PostwareFunction = (
  ctx: RewriterContext,
  response: Response,
) => Promise<Response | void>;

export type MiddlewareFunction = (
  ctx: RewriterContext,
) => Promise<void | Response>;

export type RewriterContext = {
  headElements?: Array<Promise<string>> | null;
  pageRequest: Promise<Response> | null;
  data: Record<string, any>;
  flags: Record<string, any>;
  clientSideData: Record<string, any>;
  postware: Array<PostwareFunction>;
  templates: Record<string, Template>;
  rules: Array<Rule>;
  skip?: boolean;
  cfContext: EventContext<any, any, any>;
  any: Record<string, any>;
};

export type Rule = (rewriter: HTMLRewriter, ctx: RewriterContext) => void;

export type RewriterFactoryParameters = {
  ctx: RewriterContext;
  extraRules?: Array<Rule>;
};

export type CommonResponse = CFResponse & Response;

export type Template =
  | undefined
  | null
  | string
  | Response
  | Promise<string>
  | Promise<Response>
  | ((context: RewriterContext) => string | Promise<string>);

export {};
