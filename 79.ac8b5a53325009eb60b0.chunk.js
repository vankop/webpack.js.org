(window.webpackJsonp=window.webpackJsonp||[]).push([[79],{369:function(n,e,s){"use strict";s.r(e),e.default='<blockquote class="tip">\n<p>This guide is a small follow-up to <a href="/guides/code-splitting">Code Splitting</a>. If you have not yet read through that guide, please do so now.</p>\n</blockquote>\n<p>Lazy, or "on demand", loading is a great way to optimize your site or application. This practice essentially involves splitting your code at logical breakpoints, and then loading it once the user has done something that requires, or will require, a new block of code. This speeds up the initial load of the application and lightens its overall weight as some blocks may never even be loaded.</p>\n<h2 id="example">Example<a href="#example" aria-hidden="true"><span class="icon icon-link"></span></a></h2>\n<p>Let\'s take the example from <a href="/guides/code-splitting#dynamic-imports">Code Splitting</a> and tweak it a bit to demonstrate this concept even more. The code there does cause a separate chunk, <code>lodash.bundle.js</code>, to be generated and technically "lazy-loads" it as soon as the script is run. The trouble is that no user interaction is required to load the bundle -- meaning that every time the page is loaded, the request will fire. This doesn\'t help us too much and will impact performance negatively.</p>\n<p>Let\'s try something different. We\'ll add an interaction to log some text to the console when the user clicks a button. However, we\'ll wait to load that code (<code>print.js</code>) until the interaction occurs for the first time. To do this we\'ll go back and rework the <a href="/guides/code-splitting#dynamic-imports">final <em>Dynamic Imports</em> example</a> from <em>Code Splitting</em> and leave <code>lodash</code> in the main chunk.</p>\n<p><strong>project</strong></p>\n<pre><code class="hljs language-diff">webpack-demo\n|- package.json\n|- webpack.config.js\n|- /dist\n|- /src\n  |- index.js\n<span class="token inserted">+ |- print.js</span>\n|- /node_modules</code></pre>\n<p><strong>src/print.js</strong></p>\n<pre><code class="hljs language-js">console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">\'The print.js module has loaded! See the network tab in dev tools...\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>\n  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">\'Button Clicked: Here\\\'s "some text"!\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span></code></pre>\n<p><strong>src/index.js</strong></p>\n<pre><code class="hljs language-diff"><span class="token inserted">+ import _ from \'lodash\';</span>\n<span class="token inserted">+</span>\n<span class="token deleted">- async function getComponent() {</span>\n<span class="token inserted">+ function component() {</span>\n    const element = document.createElement(\'div\');\n<span class="token deleted">-   const _ = await import(/* webpackChunkName: "lodash" */ \'lodash\');</span>\n<span class="token inserted">+   const button = document.createElement(\'button\');</span>\n<span class="token inserted">+   const br = document.createElement(\'br\');</span>\n\n<span class="token inserted">+   button.innerHTML = \'Click me and look at the console!\';</span>\n    element.innerHTML = _.join([\'Hello\', \'webpack\'], \' \');\n<span class="token inserted">+   element.appendChild(br);</span>\n<span class="token inserted">+   element.appendChild(button);</span>\n<span class="token inserted">+</span>\n<span class="token inserted">+   // Note that because a network request is involved, some indication</span>\n<span class="token inserted">+   // of loading would need to be shown in a production-level site/app.</span>\n<span class="token inserted">+   button.onclick = e => import(/* webpackChunkName: "print" */ \'./print\').then(module => {</span>\n<span class="token inserted">+     const print = module.default;</span>\n<span class="token inserted">+</span>\n<span class="token inserted">+     print();</span>\n<span class="token inserted">+   });</span>\n\n    return element;\n  }\n\n<span class="token deleted">- getComponent().then(component => {</span>\n<span class="token deleted">-   document.body.appendChild(component);</span>\n<span class="token deleted">- });</span>\n<span class="token inserted">+ document.body.appendChild(component());</span></code></pre>\n<blockquote class="warning">\n<p>Note that when using <code>import()</code> on ES6 modules you must reference the <code>.default</code> property as it\'s the actual <code>module</code> object that will be returned when the promise is resolved.</p>\n</blockquote>\n<p>Now let\'s run webpack and check out our new lazy-loading functionality:</p>\n<pre><code class="hljs language-bash"><span class="token punctuation">..</span>.\n          Asset       Size  Chunks                    Chunk Names\nprint.bundle.js  417 bytes       0  <span class="token punctuation">[</span>emitted<span class="token punctuation">]</span>         print\nindex.bundle.js     548 kB       1  <span class="token punctuation">[</span>emitted<span class="token punctuation">]</span>  <span class="token punctuation">[</span>big<span class="token punctuation">]</span>  index\n     index.html  189 bytes          <span class="token punctuation">[</span>emitted<span class="token punctuation">]</span>\n<span class="token punctuation">..</span>.</code></pre>\n<h2 id="frameworks">Frameworks<a href="#frameworks" aria-hidden="true"><span class="icon icon-link"></span></a></h2>\n<p>Many frameworks and libraries have their own recommendations on how this should be accomplished within their methodologies. Here are a few examples:</p>\n<ul>\n<li>React: <a href="https://reacttraining.com/react-router/web/guides/code-splitting">Code Splitting and Lazy Loading</a></li>\n<li>Vue: <a href="https://alexjoverm.github.io/2017/07/16/Lazy-load-in-Vue-using-Webpack-s-code-splitting/">Lazy Load in Vue using Webpack\'s code splitting</a></li>\n<li>Angular: <a href="https://angular.io/guide/router#milestone-6-asynchronous-routing">Lazy Loading route configuration</a></li>\n<li>AngularJS: <a href="https://medium.com/@var_bin/angularjs-webpack-lazyload-bb7977f390dd">AngularJS + Webpack = lazyLoad</a> by <a href="https://twitter.com/var_bincom">@var_bincom</a></li>\n</ul>\n'}}]);