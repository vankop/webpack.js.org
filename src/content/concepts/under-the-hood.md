---
title: Under The Hood
sort: 1
contributors:
  - smelukov
---

> This section describes webpack internals and useful for plugin developers

The bundling is a function that takes some files and emits others.

But between input and output, it also has [modules](/concepts/modules/), [entry points](/concepts/entry-points/), chunks, chunk groups, and many other intermediate parts.

## The main parts

Every file used in your project is a [Module](/concepts/modules/)

__./index.js__

```js
import app from './app.js';
```

__./app.js__

```js
export default 'the app';
```

By using each other, the modules form a graph (`ModuleGraph`). 

Usually, modules don't exist by themselves and combine into chunks.
Chunks combine into chunk groups and form a graph (`ChunkGraph`) interconnected through modules.
When you describe an entry point - under the hood, you create a chunk group with one chunk.

__./webpack.config.js__

```js
module.exports = {
  entry: './index.js'
};
```

One chunk group with the `main` name created (`main` is the default name for an entry point).
This chunk group contains `./index.js` module. As the parser handles imports inside `./index.js` new modules are added into this chunk.

Another example:

__./webpack.config.js__

```js
module.exports = {
  entry: {
    home: './home.js',
    about: './about.js'
  }
};
```

Two chunk groups with names `home` and `about` are created.
Each of them has a chunk with a module - `./home.js` for `home` and `./about.js` for `about`

> There might be more than one chunk in the chunk group. For example [SplitChunkPlugin](/plugins/split-chunks-plugin/) does so - it splits a chunk into one or more chunks.

## Chunks

Chunks come in two forms - `initial` and `non-initial`

`initial` is the main chunk for the entry point. This chunk contains all the modules (and its dependencies) that you specify for an entry point.

`non-initlal` is a chunk that may be lazy-loaded. It may appear when [dynamic import](/guides/code-splitting/#dynamic-imports) or [SplitChunkPlugin](/plugins/split-chunks-plugin/) is being used.

Each chunk has a corresponding __asset__.
The assets are the output files - the result of bundling.

__webpack.config.js__

```js
module.exports = {
  entry: './src/index.jsx'
};
```

__./src/index.js__

```js
import React from 'react';
import ReactDOM from 'react-dom';

import('./app.jsx').then(App => ReactDOM.render(<App />, root));
```

Initial chunk with name `main` is created. It contains:

- `./src/index.jsx`
- `react`
- `react-dom`

and all their dependencies, except `./app.jsx`

Non-initial chunk for `./app.jsx` is created as this module is imported dynamically.

__Output:__

- `/dist/main.js` - an initial chunk 
- `/dist/394.js` - non-initial chunk

By default, there is no name for non-initial chunks so that a unique ID is used instead of a name.
In the case of dynamic import we may specify a chunk name explicitly by using a ["magic" comment](/api/module-methods/#magic-comments):

```js
import(
  /* webpackChunkName: "app" */
  './app.jsx'
).then(App => ReactDOM.render(<App />, root));
```

__Output:__

- `/dist/main.js` - an initial chunk 
- `/dist/app.js` - non-initial chunk

## Output

The names of the output files are affected by two fields in the config:

- `output.filename` - for initial chunk files
- `output.chunkFilename` - for non-initial chunk files

A few placeholders are available in these fields. Most often:

- `[id]` - chunk id (e.g. `[id].js` -> `485.js`)
- `[name]` - chunk name (e.g. `[name].js` -> `app.js`). If a chunk has no name, then its id will used
- `[contenthash]` - md4-hash from output file content (e.g. `[contenthash].js` -> `4ea6ff1de66c537eb9b2.js`)
