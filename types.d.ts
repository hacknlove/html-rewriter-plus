import {
  EventContext,
  Response as CFResponse,
} from "@cloudflare/workers-types";

export type PostwareFunction = (
  cfContext: EventContext<any, any, any>,
  rewriterContext: RewriterContext,
  response: Response,
) => Promise<Response | void>;

export type MiddlewareFunction = (
  cfContext: EventContext<any, any, any>,
  rewriterContext: RewriterContext,
) => Promise<void | Response>;

export type RewriterContext = {
  headElements?: Array<Promise<string>> | null;
  pageRequest: Promise<Response> | null;
  data: Record<string, any>;
  flags: Record<string, any>;
  clientSideData: Record<string, any>;
  postware: Array<PostwareFunction>;
  template: string;
  templates: Record<string, string>;
  rules: Array<Rule>;
  skip?: boolean;
};

export type Rule = (
  rewriter: HTMLRewriter,
  rewriterContext: RewriterContext,
) => void;

export type RewriterFactoryParameters = {
  rewriterContext: RewriterContext;
  extraRules?: Array<Rule>;
};

export type CommonResponse = CFResponse & Response;

export {};
