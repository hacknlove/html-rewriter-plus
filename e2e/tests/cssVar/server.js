import { onRequestFactory } from "../../dist/esm/index.js";

import template from './template.html';

export const onRequestGet = onRequestFactory({
  template,
  data: {
    color: {
      primary: "black",
    }
  },
});

export default {
  async fetch(request, env, ctx) {
    return onRequestGet({ request, env, ...ctx });
  }
}