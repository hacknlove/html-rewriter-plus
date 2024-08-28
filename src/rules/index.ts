import { ssrMap } from "./ssr-map";
import { ssrStyleDataSsrCssVars } from "./ssr-style-data-ssr-css-vars";
import { ssrFlags } from "./flags";
import { ssrHead } from "./head";
import { ssrEnd } from "./ssrEnd";
import { ssrIf } from "./ssrIf";

export const rules = [
  ssrMap,
  ssrStyleDataSsrCssVars,
  ssrFlags,
  ssrHead,
  ssrEnd,
  ssrIf,
];
