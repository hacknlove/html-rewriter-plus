# HTMLRewriter+

Static generated sites with dynamic content.

## How it works

Use any static site generator to generate your site.

Add some `data-ssr-*` attributes to your HTML elements.

Use cloudflare page functions to fetch the data asynchronously, and render the HTML, injecting the data into the elements on the fly.

### Quick example

```html
<!-- public/some-template.html -->
<img
    data-ssr-map="foo.bar:src,foo.buz:alt"
/>
```

```javascript
// functions/some-path.js

export const onRequestGet = onRequestFactory({
  template: "/some-template",
  data: {
    foo: fetch("https://api.example.com/foo").then((res) => res.json()),
  },
});
```

The html file start streaming to the client as soon as the template is fetched.

`data.foo` is not awaited until the first time it is accessed.

### Deferred Dynamic Head elements

Any head element that needs to access data, will be automatically deferred to the end of the head element, so the browser gets all the static resources first, like stylesheets, scripts, and preloads, without awaiting for the asynchronous data to be available.

### Client-side data

You might need dynamic data that is not available at build time.

In this case, you use the `clientSideData` field in the `onRequestFactory` options.

```javascript
// functions/some-path.js

export const onRequestGet = onRequestFactory({
  template: "/some-template",
  clientSideData: {
    foo: 'bar',
  },
,
});
```

This data will be available in the client-side, at `window.data`

And the event `on-data-loaded` will be dispatched on the `document` object, as soon as the data is available.

### Body classes flags

You can add classes to the body element, based on flags you set in the `onRequestFactory` options.

```javascript
// functions/some-path.js
export const onRequestGet = onRequestFactory({
  template: "/some-template",
  flags: {
    'is-logged-in': true,
  },
});
```

Flag promises will be awaited just before the body element is rendered.

### Middlewares

You can define middlewares that will be called in order before the asynchronous response is created.

Any asynchronous middleware will be awaited.

### Postwares

You can define postwares that will be called in order

They can modify the response, to add cookies or to change the headers, for instance.