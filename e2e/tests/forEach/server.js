import { onRequestFactory } from "../../dist/esm/index.js";

import template from './template.html';

export const onRequestGet = onRequestFactory({
  template,
  templates: {
    "thisOneFromHtml": "<b data-ssr-map='word:innerText'></b>",
    "thisOneFromHandler": "<i data-ssr-map='word:innerText'></i>",
  },
  data: {
    words: ["lorem", "ipsum", "dolor", "sit"],
  },
});

export default {
  async fetch(request, env, ctx) {
    return onRequestGet({ request, env, ...ctx });
  }
}