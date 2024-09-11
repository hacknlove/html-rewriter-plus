const { onRequestFactory } = require("./dist/commonjs/index.js");

exports.onRequestGet = onRequestFactory({
  template: `<template 
            data-ssr-for="item"
            data-ssr-in="items" ssr-data-ssr-render-template="test"></template>`,
  data: {
    items: [{ title: "Item 1" }, { title: "Item 2" }, { title: "Item 3" }],
  },
  templates: {
    test: '<div data-ssr-map="item.title:title"></div>',
  },
});
