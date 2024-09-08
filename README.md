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

## Directives

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

### Define template 
**Element:** `template`
**Attribute:** `data-ssr-name`
**Value:** The name of the template

It defines the templated named `name` so it can be used by other directives.

currently, only the `for each` directive uses templates

```html
<!-- public/some-template.html-->
<template data-ssr-name="bookCard">
  <div class="catd">
    <h2 data-ssr-map="book.title:innetText" />
    <h3 data-ssr-map="book.author:innerHtml" />
    <img data-ssr-map="book.cover:src">
    <div class="description" data-ssr-map="book.description:imnerHTML" />
  </div>
</div>
```

**Note:** Templates must be set before they are used

**Note:** Templates can be set using the API

### For Each
**Element:** `template`
**Attribute:** `data-ssr-for`
**Value:** The name of the field to be used to hold the array elements
**Attribute:** `data-ssr-in`
**Value:** The name of the field where the array lies
**Attribute:** `data-ssr-reder-template`
**Value:** The name of the template to render

It renders the said template for each item of the array, storing it with the specified name

```html
<!-- public/some-template.html -->
<template data-ssr-for="book" data-ssr-in="books" data-ssr-render-template="bookCard" />
```




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

### All options

* `template`: the path to the template file.
* `data`: the data object that will be used to render the template.
* `middlewares`: an array of functions that will be called in order before the data functions are called.
* `flags`: an object with flags that will be used to set classes in the body element.
* `postwares`: an array of functions that will be called in order after the data functions are called, and the response starts to be created.
* `clientSideData`: an object with data that will be available in the client-side, at `window.data`.
* `rules`: an array of extra rules that will be used to rewrite the response.
* `templates`: an object of templates, as strings, promises, or functions

### template
It's the template or the route to the template file, within the static generated site, that will be used to render the page.
It can be also a promise of the template, or a function that returns the template as a string or as `Response`, (or as a promise that resolves to a string or a `Response`).

If the string starts by `/` it will be considered a path to get the template.

If the string starts by `//`, `http://`, or `https://`, it will be considered a URL to get the template.

Otherwise, it will be considered the template itself.

**Note:** If the template is falsy, the template will be the same as the path.

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

// ctx is not used in this example, but it's available
function getUser(ctx) {
  const userId = ctx.cfContext.params.userId;
  return fetch(`https://jsonplaceholder.typicode.com/users/${userId}`).then(response => response.json());
}
```

**Note:** The data functions will be called at the very beginning of the request, but same as the set promises, they won't be awaited until the field is used.

### middlewares

You can define middlewares that will be executed and awaited in order before the data functions are called.

**Uses:**

Return something different than the template.

```javascript
// functions/some-path.js
export const onRequestGet = onRequestFactory({
  template: "/some-template",
  middlewares: [
    (ctx) => {
      if (!cfContext.request.headers.get('authorization')) {
        // Redirect to login page
        return new Response(null, {
          status: 302,
          headers: {
            'Location': '/login'
        });
      },
    }
  ],
  data: {
    post: getPost
  },
});
```

Render a different template.
```javascript
// functions/some-path.js
export const onRequestGet = onRequestFactory({
  template: "/some-template",
  middlewares: [
    (ctx) => {
      if (!ctx.cfContext.request.headers.get('authorization')) {
        ctx.template = "/login-required";
        ctx.data = {
          redirect: ctx.cfContext.request.url
        }
      }
    },
  ],
  data: {
    post: getPost
  },
});
```


Set values in the context object, to be used by the data functions.

```javascript
export const onRequestGet = onRequestFactory({
  template: "/some-template",
  middlewares: [
    (ctx) => {
      ctx.lang = ctx.cfContext.request.headers.get('accept-language');
    },
  ],
  data: {
    post: getPost
  },
});

function getPost(ctx) {
  const lang = ctx.lang;
  // fetch the post using the lang
}
```

Another option is to use the data itself, but remember to place the required field before it's used by other fields.

```javascript
export const onRequestGet = onRequestFactory({
  template: "/some-template",
  middlewares: [
    (ctx) => {
      ctx.lang = ctx.cfContext.request.headers.get('accept-language');
    },
  ],
  data: {
    lang: ctx => ctx.cfContext.request.headers.get('accept-language'),
    post: getPost
  },
});

function getPost(ctx) {
  const lang = ctx.data.lang;
  // fetch the post using the lang
}
```

Rewrite the request, to serve a different file.

```javascript
// functions/some-path.js

import otherPath from './other-path.js';

export const onRequestGet = onRequestFactory({
  template: "/some-template",
  middlewares: [
    (cfContext) => {
      if (someCondition) {
        return otherPath.onRequestGet(cfContext);
      }
    },
  ],
  data: {
    post: getPost
  },
});
```

### Flags

Flags work like data, but they are used to set classes in the body element.

You can set static flags, or promises that will be awaited just before the flag is used.

You can also set a function that will be called with the cloudflare context object, and the object that was passed to `onRequestFactory`.

Then when the body element is rendered, the flags will be awaited and used to set classes.

```javascript
// functions/some-path.js
export const onRequestGet = onRequestFactory({
  template: "/some-template",
  flags: {
    'is-iphone': ctx => ctx.cfContext.request.headers.get('user-agent').includes('iPhone'),
  },
  data: {
    post: getPost
  },
});

// <body class="is-iphone">
```

### postwares

Postwares are functions that will be called in order after the data functions are called, and the response starts to be created.

You can use them to modify the response, to add cookies, or to change the headers, for instance.

```javascript
// functions/some-path.js
export const onRequestGet = onRequestFactory({
  template: "/some-template",
  postwares: [
    (ctx, response) => {
      response.headers.set('Cache-Control', 'public, max-age=3600');
    },
  ],
  data: {
    post: getPost
  },
});
```

You can also use a postware to deal with optimistic fallbacks

```javascript
// functions/some-path.js
export const onRequestGet = onRequestFactory({
  template: "/some-template",
  postwares: [
    (ctx, response) => {
      if (!(await ctx.data.getPost)) {
        return new Response('Not found', { status: 404 });
      }
    },
  ],
  data: {
    post: getPost
  },
});
```

**Note:** But awaiting the data in the postware will block the response to be streamed to the client until the data is available. As soon as the data is available, the streaming will start sending all the HTML until the point on the html where the field is used; which is better than awaiting for the whole html to be rendered; but still it's much better to not await the data in the postware, and let the response be streamed to the client from the first byte.

### clientSideData

It works pretty much like the `data` field, but it's not used to render the template. The data will be available in the client-side, at `window.data`.

If you set a function, it will be called with the cloudflare context object, and the object that was passed to `onRequestFactory`.

Any promise will be awaited just before the data is injected into the stream, after the HTML is sent to the client.


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
### Rules

You can set extra rules that will be used to rewrite the response.

It's an array of functions that accept the rewriter and the ctx.

```javascript
// functions/some-path.js
export const onRequestGet = onRequestFactory({
  template: "/some-template",
  rules: [
    (rewriter, ctx) => {
      rewriter.on('img:not([alt])', (element) => {
        element.setAttribute('alt', '');
      });
    },
  ],
});
```

### Templates
it's an object whose keys are the names of the templates and whose values are the templates that can be used by other directives to render data.

The values are dealt with the same way as the `template` field.
