import { onRequestFactory } from "../../dist/esm/index.js";

import template from './template.html';

export const onRequestGet = onRequestFactory({
  template,
  clientSideData: {
    foo: 'bar',
    bar: 'foo',
    baz: ['foo', 'bar', 'baz'],
  },
});

export default {
  async fetch(request, env, ctx) {
    return onRequestGet({ request, env, ...ctx });
  }
}