import { EventContext } from "@cloudflare/workers-types";

export function isWebsocket(context: EventContext<any, any, any>) {
  return context.request.headers.get("Upgrade") === "websocket";
}
