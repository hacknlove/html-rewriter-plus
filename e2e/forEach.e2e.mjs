import { onRequestFactory } from "./dist/esm/index.js";

export const onRequestGet = onRequestFactory({
  template: `<div><template data-ssr-name="test">
    <div data-ssr-map="item.title:title"></div>
    </template>
    <template 
              data-ssr-for="item"
              data-ssr-in="items"
              ssr-data-render-template="test"></template></div>`,

  data: {
    items: [{ title: "Item 1" }, { title: "Item 2" }, { title: "Item 3" }],
  },
  templates: {
    test: '<div data-ssr-map="item.title:title"></div>',
  },
});

export default {
  async fetch(request, env, ctx) {
    return onRequestGet({ request, env, ...ctx });
  }
}