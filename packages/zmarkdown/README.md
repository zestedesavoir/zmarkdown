# zmarkdown

  [![NPM Version][npm-image]][npm-url]
  [![Test Coverage][coveralls-image]][coveralls-url]

This project is an **HTTP Server API** providing fast and extensible **markdown parser**. It is the Markdown engine powering [Zeste de Savoir][zds].

It is a small express server leveraging the [**remark**
processor][processor] and its [**MDAST**][mdast] syntax tree, [**rehype**][rehype] (for HTML processing) and [**textr**][textr] (text transformation framework). It also provides [**MDAST**][mdast] to LaTeX compilation via [**rebber**][rebber] (and its [plugins][rebber-plugins]).

```log
curl -H "Content-Type: application/json" -X POST -d '{"md":"Hello word"}' http://localhost:27272/html
#return: ["<p>Hello word</p>",{"disableToc":true,"languages":[],"depth":1},[]]
```

[npm-image]: https://img.shields.io/npm/v/zmarkdown.svg
[npm-url]: https://npmjs.org/package/zmarkdown
[downloads-image]: https://img.shields.io/npm/dm/zmarkdown.svg
[downloads-url]: https://npmjs.org/package/zmarkdown
[travis-image]: https://img.shields.io/travis/zestedesavoir/zmarkdown/master.svg?label=linux
[travis-url]: https://travis-ci.com/zestedesavoir/zmarkdown
[coveralls-image]: https://img.shields.io/coveralls/zestedesavoir/zmarkdown/master.svg
[coveralls-url]: https://coveralls.io/r/zestedesavoir/zmarkdown?branch=master

[zds]: https://zestedesavoir.com
[processor]: https://github.com/remarkjs/remark/blob/master/packages/remark
[mdast]: https://github.com/wooorm/mdast
[rehype]: https://github.com/rehypejs/rehype
[textr]: https://github.com/A/textr
[rebber]: https://github.com/zestedesavoir/zmarkdown/tree/master/packages/rebber#rebber--
[rebber-plugins]: https://github.com/zestedesavoir/zmarkdown/tree/master/packages/rebber-plugins#rebber-plugins--

## Features

 - Convert Markdown to HTML ;
 - Convert Markdown to EPUB compatible HTML ;
 - Convert Markdown to LaTeX ;
 - Convert Markdown to TEX file;
 - Convert ordered list of Markdown extracts into one of the above formats.

## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the [npm registry][npm-url]. Install with npm:

```
npm install zmarkdown
```

## Getting started

 1. Start your zmarkdown server `npm run server`
 2. Send a `POST` request to `http://localhost:27272/{endpoint}`
 
`pm2 monit`: provides a realtime dashboard that fits directly into your terminal, it is a [simple way to monitor][pm2-monit] the resource usage of you server.

[pm2-monit]:http://pm2.keymetrics.io/docs/usage/monitoring/

### Limit the resource usage of your server

You can change the number of threads (default: `3`) and the max-memory of each thread (default: `150M`) in your package.json at `scripts.server` :

```json
    "server": "pm2 start -f server/index.js -i 3 --max-memory-restart 150M",
```

## Requests
All endpoints respond to `HTTP POST`. The request body must be JSON with a required `md` key. An optional `opts` key can be provided, the value of which depends on the endpoint.

### URL

```
POST http://localhost:27272/{endpoint}
```

### Body

#### Required Body JSON Value

| Name | Type | Description |
| - | - | - |
| `md` | string | markdown source string or ordered list of Markdown extracts (see below) |

#### Optional Body JSON Value

| Name | Type | Description |
| - | - | - |
| `opts` | JSON | Options specific to this endpoint. This object is documented in the **Request** section of each endpoint. |

### Response

All endpoints return `[contents, metadata, messages]` as JSON.

| Name | Type | Description |
| - | - | - |
| `contents` | string | the rendered HTML or LaTeX. |
| `metadata` | object | depends on request options. This object is documented in the **Response** section of each endpoint. |
| `messages` | string[] | info/debug/errors from parsers, plugins, compilers, etc. |

Only `metadata` is described in the **Response** sections below.

# Endpoints 

[ref-epub]: #epub
[ref-html]: #html
[ref-latex]: #latex
[ref-tex]: #tex

## epub

Markdown to EPUB compatible HTML

### URL

```
POST http://localhost:27272/epub
```

### Request `opts` values

| Name | Type | Description |
| - | - | - |
| `opts.images_download_dir` | bool | [see `/latex`][ref-latex] |
| `opts.local_url_to_local_path` | string | [see `/latex`][ref-latex] |

### Response `metadata` values

| Name | Type | Description |
| - | - | - |
| `metadata.disableToc` | bool | Whether or not the input Markdown did **not** contain headings (`#`, `##`, …). This property is named that way because we use it to disable Table of Contents generation when no headings were found.<br>- `disableToc: true` means *no headings*<br>- `disableToc: false` means at least one *heading*. |

## html

Markdown to HTML

### URL

```
POST http://localhost:27272/html
```

### Request `opts` values

| Name | Type | Description |
| - | - | - |
| `opts.disable_ping` | bool | default: `false`, [pings][ping] won't get parsed. |
| `opts.disable_jsfiddle` | bool |  default: `false`, JSFiddle [iframes][iframes] are disabled. |
| `opts.inline` | bool | default: `false`, Only parse inline Markdown elements (such as links and emphasis, unlike lists and fenced code blocks). |
| `opts.stats` | bool | default: `false`, Will compute and return statistics about markdown text. |

### Response `metadata` values

| Name | Type | Description |
| - | - | - |
| `metadata.disableToc` | bool | Whether or not the input Markdown did **not** contain headings (`#`, `##`, …). This property is named that way because we use it to disable Table of Contents generation when no headings were found.<br>`disableToc: true` means *no headings*<br>`disableToc: false` means at least one *heading* |
| `metadata.ping` | string[] | undefined if `opts.disable_ping: true`<br>The list of nicknames returned by `remark-ping`. Can be used to send "ping" notifications to the corresponding users.<br>Note: this is fully customizable, `remark-ping` can validate potential *ping*s by any means, including sending an HTTP request (we recommend `HEAD`) to a REST API to make sure this username actually exists. |
| `metadata.languages` | string[] | A list of unique languages used in GitHub Flavoured Markdown fences with a flag. |
| `metadata.stats` | object | stats about the parsed text:<br>- `signs`: number of chars, spaces included.<br>- ` words`: number of words. |

### Example

Here is a quick example of the request to be made to the `http://localhost:27272/html` endpoint, using the software of your choice:

```json
{
  "md": "# Hello\n\nThis is @zmarkdown, a wonderful [Markdown](https://fr.wikipedia.org/wiki/Markdown) parser. You can **embed** code in it:\n\n```js\n\nconst zmd = require('zmarkdown/modules/common')\n\n\n\nconst globalParser = common(opts, processor)\n\n```\n\n- Oh wait, this is *Mise en abyme*, isn't it?\n\n- Of course it is, you @silly.\n\n- Silly, me? Let me remind you that the main usage of this module is to launch the server directly, not using this Node.js crap:\n\n```bash\n\nnpm -g install pm2 && npm install zmarkdown\ncd ./node_modules/zmarkdown && npm run server\n\n```\n\nNow you know how it works, at least for the API endpoint, but we do support a lot more syntax, if you want.",
  "opts": {
    "stats": true
  }
}
```

This request will trigger the following response from the server:

```json
[
  "<h3 id=\"hello\">Hello<a aria-hidden=\"true\" href=\"#hello\"><span class=\"icon icon-link\"></span></a></h3>\n<p>This is <a href=\"/@zmarkdown/\" rel=\"nofollow\" class=\"ping ping-link\">@<span class=\"ping-username\">zmarkdown</span></a>, a wonderful <a href=\"https://fr.wikipedia.org/wiki/Markdown\">Markdown</a> parser. You can <strong>embed</strong> code in it:</p>\n<div class=\"hljs-code-div\"><div class=\"hljs-line-numbers\"><span></span><span></span><span></span><span></span><span></span></div><pre><code class=\"hljs language-js\"><span class=\"hljs-keyword\">const</span> zmd = <span class=\"hljs-built_in\">require</span>(<span class=\"hljs-string\">'zmarkdown/modules/common'</span>)\n\n\n\n<span class=\"hljs-keyword\">const</span> globalParser = common(opts, processor)\n</code></pre></div>\n<ul>\n<li>\n<p>Oh wait, this is <em>Mise en abyme</em>, isn’t it?</p>\n</li>\n<li>\n<p>Of course it is, you <a href=\"/membres/voir/silly/\" rel=\"nofollow\" class=\"ping ping-link\">@<span class=\"ping-username\">silly</span></a>.</p>\n</li>\n<li>\n<p>Silly, me? Let me remind you that the main usage of this module is to launch the server directly, not using this Node.js crap:</p>\n</li>\n</ul>\n<div class=\"hljs-code-div\"><div class=\"hljs-line-numbers\"><span></span><span></span></div><pre><code class=\"hljs language-bash\">npm -g install pm2 &#x26;&#x26; npm install zmarkdown\n<span class=\"hljs-built_in\">cd</span> ./node_modules/zmarkdown &#x26;&#x26; npm run server\n</code></pre></div>\n<p>Now you know how it works, at least for the API endpoint, but we do support a lot more syntax, if you want.<p>",
  {
    "ping": [
      "zmarkdown",
      "silly"
    ],
    "disableToc": false,
    "languages": [
      "js",
      "bash"
    ],
    "depth": 5,
    "stats": {
      "signs": 386,
      "words": 78
    }
  },
  []
]
```

## LaTeX

Markdown to LaTeX

### URL

```
POST http://localhost:27272/epub
```

### Request `opts` values

| Name | Type | Description |
| - | - | - |
| `opts.disable_images_download` | bool | Default: `false`, does not download images. |
| `opts.images_download_dir` | string | Where to download the images to. |
| `opts.images_download_default` | string | Default: `black.png`, image used when the distant image is not found. |
| `opts.images_download_timeout` | number | Default: `5000` ms. HTTP request timeout for each image, in milliseconds. |
| `opts.local_url_to_local_path` | - | [see below](#optslocal_url_to_local_path) this table. |
| `opts.disable_jsfiddle` | bool | [see `/html`][ref-html] |

### opts.local_url_to_local_path

 - \[from: string, to: string\], default: `<none>`

   If provided, local images referenced in Markdown source (such as `![](/img/example.png)`)
   will be copied to `images_download_dir` after replacing the string `from` with `to` using
   the following RegExp:

   ```js
   '/img/example.png'.replace(new RegExp(`^${from}`), to)
   ```

### Response `metadata` values

This endpoint only returns `{}` as metadata, i.e. an empty object.

## TeX

Markdown to TEX file

### URL

```
POST http://localhost:27272/latex-document
```

### Request required `opts` values

These values are **required**.

| Name | Type | Description |
| - | - | - |
| `opts.content_type` | string | (**required**) Will be interpolated in `\documentclass[${content_type}]{zmdocument}` |
| `opts.title` | string | (**required**) Will be interpolated in `\title{${title}}` |
| `opts.authors`, | string[] | (**required**) Will be interpolated in `\author{${authors.join(', ')}}` |
| `opts.license` | string | (**required**) E.g. `CC-BY-SA` will be displayed as-is, using `${license_directory}/by-sa.svg` as license icon with a link to `https://creativecommons.org/licenses/by-sa/4.0/legalcode` |
| `opts.license_directory` | string | (**required**) Path to the directory where CC license SVG icons are stored, see `license` above. |
| `opts.smileys_directory` | string | (**required**) Path to the directory where smileys are stored. |
  
### Request `opts` values

| Name | Type | Description |
| - | - | - |
| `opts.disable_images_download` | bool | [see `/latex`][ref-latex] |
| `opts.images_download_dir` | string | [see `/latex`][ref-latex] |
| `opts.images_download_default` | string | [see `/latex`][ref-latex] |
| `opts.local_url_to_local_path` | string | [see `/latex`][ref-latex] |
| `opts.disable_jsfiddle` | bool | [see `/html`][ref-html] |

### Response `metadata` values

This endpoint only returns `{}` as metadata, i.e. an empty object.

## Manifest rendering

Since version 10.0.0, ZMarkdown supports *manifest rendering*, which means it is capable of processing asynchronously an ordered list of Markdown extracts, and assembling them back together. Manifest rendering works with all the four endpoints described above. Let's take an example with HTML; the following request body:

```json
{
  "md": {"text":"# foo\n\nHello @you", "children": [{"text": "Foobar"}, {"text": "Barfoo"}]},
  "opts": {
    "stats": true
  }
}
```

Will lead to the following response from the server:

```json
[
  {
    "text": "<h2 id=\"foo\">foo<a aria-hidden=\"true\" tabindex=\"-1\" href=\"#foo\"><span class=\"icon icon-link\"></span></a></h2>\n<p>Hello <a href=\"/@you/\" rel=\"nofollow\" class=\"ping ping-link\">@<span class=\"ping-username\">you</span></a><p>",
    "children": [
      {
        "text": "<p>Foobar</p>"
      },
      {
        "text": "<p>Barfoo</p>"
      }
    ]
  },
  {
    "ping": [
      "you"
    ],
    "stats": {
      "signs": 24,
      "words": 5
    },
    "depth": 1,
    "disableToc": false,
    "languages": []
  },
  []
]
```

As you can see, the extracts are positionned in the right order, and VFiles are automatically assembled. Calling the `latex-document` endpoint will also concatenate the extracts and produce a complete document.

## Client Architecture

Four client builds are currently available (starting from version 9.0.0), they can all be found in the `client/dist` folder:

- `zmarkdown-zmdast` compiles Markdown to MDAST and return the result, and optionally an inspector to get a pretty output;
- `zmarkdown-zhtml` compiles Markdown to HTML, using the same modules as the server, but this renderer is quite huge (1.8 MB), so it is not recommended for use in a web browser;
- `zmarkdown-zhlite` is a browser-friendly version of the MD-to-HTML renderer; it has the same capabilities, except for KaTeX and highlight.js, so you'll need to provide yourself if you want to use them;
- `zmarkdown-zlatex` compiles Markdown to LaTeX, using the same modules as the server.

### Getting started

Simply import one of the three files mentionned above, it will expose a `ZMarkdownZ*`, depending on the imported file. For instance, `zhlite` exposes a `ZMarkdownZHLITE` object. This exported object have a `render` method, that takes the input string and a callback.

### Example

```javascript
ZMarkdownZHTML.render("# Hello", (err, vFile) => {
  console.log(vFile.contents);
  // will display: "<h1 id="title">Title<a aria-hidden="true" href="#title"><span class="icon icon-link"></span></a></h1>"
});
```

### Specific MDAST renderer

The MDAST renderer is synchronous, unlike the other renderers, so it will return instead of requiring a callback. Moreover, this renderer exposes an `inspect` method, from [unist-util-inspect].

## Builds

### Dev build

If you want to watch the local files while working zmarkdown, you can use `npm run watch:client`. Run the client by opening `./public/index.html`.

*Note: the current implementation (parallel-webpack) doesn't support hot-reload, you will have to manually refresh the webpage after each change*.

### Production build

To build for production, just run `npm run release`. Generated files are located in `./dist`.

[ping]: https://www.npmjs.com/package/remark-ping
[iframes]: https://www.npmjs.com/package/remark-iframes
[unist-util-inspect]: https://www.npmjs.com/package/unist-util-inspect
