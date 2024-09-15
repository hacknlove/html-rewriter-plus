import { onRequestFactory } from "../../dist/esm/index.js";

import template from './template.html';

export const onRequestGet = onRequestFactory({
  template,
  rules: [
    rewriter => {
      rewriter.on('[data-foo]', {
        element: (element) => {
        const foo = element.getAttribute('data-foo');
        element.setAttribute('data-bar', foo);
        element.removeAttribute('data-foo');
      }
    })}
  ]
});

export default {
  async fetch(request, env, ctx) {
    return onRequestGet({ request, env, ...ctx });
  }
}