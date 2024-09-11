import { ssrMap } from "./ssrMap.js";
import { ssrStyleCssVars } from "./ssrStyleCssVars.js";
import { ssrFlags } from "./flags.js";
import { ssrHead } from "./head.js";
import { ssrEnd } from "./ssrEnd.js";
import { ssrIf } from "./ssrIf.js";
import { ssrTemplate } from "./template.js";
import { ssrForEach } from "./forEach.js";

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
