import { ssrMap } from "./ssrMap";
import { ssrStyleCssVars } from "./ssrStyleCssVars";
import { ssrFlags } from "./flags";
import { ssrHead } from "./head";
import { ssrEnd } from "./ssrEnd";
import { ssrIf } from "./ssrIf";
import { ssrTemplate } from "./template";
import { ssrForEach } from "./forEach";

export const fullRules = [
  ssrMap,
  ssrStyleCssVars,
  ssrFlags,
  ssrHead,
  ssrEnd,
  ssrIf,
  ssrTemplate,
  ssrForEach,
];

export const smallRules = [ssrMap, ssrStyleCssVars, ssrIf, ssrTemplate];
