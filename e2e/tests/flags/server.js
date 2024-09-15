import { onRequestFactory } from "../../dist/esm/index.js";

import template from './template.html';

export const onRequestGet = onRequestFactory({
  template,
  flags: {
    foo: true,
    bar: false,
  }
});

export default {
  async fetch(request, env, ctx) {
    return onRequestGet({ request, env, ...ctx });
  }
}