import { ssrMap } from "./ssrMap";
import { ssrStyleCssVars } from "./ssrStyleCssVars";
import { ssrFlags } from "./flags";
import { ssrHead } from "./head";
import { ssrEnd } from "./ssrEnd";
import { ssrIf } from "./ssrIf";

export const rules = [
  ssrMap,
  ssrStyleCssVars,
  ssrFlags,
  ssrHead,
  ssrEnd,
  ssrIf,
];
