import { onRequestFactory } from "../../dist/esm/index.js";

import template from './template.html';

export const onRequestGet = onRequestFactory({
  template,
  data: {
    title: "ssrMap test",
    content: "<p>ssrMap content</p>",
    "class": "ssrMap-test",
  },
});

export default {
  async fetch(request, env, ctx) {
    return onRequestGet({ request, env, ...ctx });
  }
}