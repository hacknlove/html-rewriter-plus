# HTMLRewriter+

Static generated sites with dynamic content.

## Install

```bash
npm install html-rewriter-plus
```

## How it works

Use any static site generator to generate your site.

Serve it with cloudflare pages.

Add some `data-ssr-*` attributes to your HTML elements.

Use cloudflare page functions to fetch the data asynchronously, and render the HTML, injecting the data into the elements on the fly.

## Template directives

Use any static site generator to generate your site.

### Conditional rendering

**Element:** any
**Attribute:** `data-ssr-if`
**Value:** A path to a value in the data object.

```html
<!-- public/some-template.html -->
<dialog data-ssr-if="page.hasSpoiler" class="full-screen">
    Are you sure you want to read this? It contains spoilers.
  <form method="dialog">
    <button>Yes</button>
  </form>
</dialog>
```

**Note:** Expressions are not allowed in the value, only paths.
Any logical operation should be done in the function, not in the template.

### Map data to attributes

**Element:** any
**Attribute:** `data-ssr-map`
**Value:** A comma-separated list of `path:attribute` pairs; `innerHTML` and `innerText` can be used to set the inner content of the element.

```html
<!-- public/some-template.html -->
 <h1 data-ssr-map="post.title:innerText,post.">
  default content
</h1>
```

**Note:** Static content will be overwritten by the mapped data.

### Map data to css variables

**Element:** `style`
**Attribute:** `data-ssr-css-vars`
**Value:** A comma-separated list of `path:variable` pairs.

```html
<!-- public/some-template.html -->
<style data-ssr-css-vars="theme.backgroundColor:background-color,theme.color:color"></style>
```

**Note:** The css variables be set to the root element of the document.

## Cloudflare Pages functions

Follow the cloudflare pages functions documentation to deal with routes.

Use `onRequestFactory` to make the route render the template.

```javascript
// functions/some-path.js
import { onRequestFactory } from "html-rewriter-plus";

export const onRequestGet = onRequestFactory({
  template: "/some-template",
  data: {
    ...,
  },
});
```

### template
It's the route to the template file, within the static generated site.

### data
It's the data object that will be used to render the template.

You can set static data, or promises that will be awaited just before the field is used.

You can also set a function that will be called with the cloudflare context object, and the object that was passed to `onRequestFactory`.

```javascript

// functions/user/[userId].js
import { onRequestFactory } from "html-rewriter-plus";

export const onRequestGet = onRequestFactory({
  template: "/some-template",
  data: {
    meaningOfLife: 42,
    
    // This will be called at startup time
    todo: fetch('https://jsonplaceholder.typicode.com/todos/1').then(response => response.json()), 
    
    // This will be called for each request
    user: getUser
  },
});

// the rewrite context is not used in this example, but it's available
function getUser(cfContext, rewriteContext) {
  const userId = cfContext.params.userId;
  return fetch(`https://jsonplaceholder.typicode.com/users/${userId}`).then(response => response.json());
}
```

**Note:** The data functions will be called at the very beginning of the request, but same as the set promises, they won't be awaited until the field is used.

### middlewares

You can define middlewares that will be executed and awaited in order before the data functions are called.

You can use them to set values in the context object, to be used by the data functions.

```javascript
export const onRequestGet = onRequestFactory({
  template: "/some-template",
  middlewares: [
    (cfContext, rewriteContext) => {
      rewriteContext.lang = cfContext.request.headers.get('accept-language');
    },
  ],
  data: {
    post: getPost
  },
});
```

You can use them too, to change the template.
  
```javascript
export const onRequestGet = onRequestFactory({
  template: "/some-template",
  middlewares: [
    (cfContext, rewriteContext) => {
      if (!context.request.headers.get('authorization')) {
        rewriteContext.template = "/login-required";
        rewriteContext.data = {}
      }
    },
  ],
  data: {
    post: getPost
  },
});
```

### Flags

### postwares

### clientSideData

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
