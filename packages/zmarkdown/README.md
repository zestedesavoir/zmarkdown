# zmarkdown server HTTP API

### Usage

* See `npm run server`
* `pm2 monit` etc

### Requests
All endpoints respond to `HTTP POST` requests sending a JSON body with these keys:

* `md` - required, markdown source string
* `opts` - optional, JSON options

`md` being a boring Markdown string, only `opts` will be specified below.

### Responses

All endpoints return `[contents, metadata, messages]` as JSON.

* `contents` - string, the rendered HTML or LaTeX
* `metadata` - object, depends on request options
* `messages` - string[], info/debug/errors from parsers, plugins, compilers etc

Only `metadata` is described in the **Response** sections below.

# Endpoints

## `/epub` - Markdown to HTML

### Request

* `opts.images_download_dir`: see `/latex`
* `opts.local_url_to_local_path`: see `/latex`

### Response

* `metadata.disableToc`, bool

  Whether or not the input Markdown did **not** contain headings (`#`, `##`, …). This property is named that way because we use it to disable Table of Contents generation when no headings were found.
  `disableToc: true` means *no headings*
  `disableToc: false` means at least one *heading*

## `/html` - Markdown to HTML

### Request

* `opts.disable_ping`, bool, default: `false`

  [pings][ping] won't get parsed

* `opts.disable_jsfiddle`, bool, default: `false`

  JSFiddle [iframes][iframes] are disabled

* `opts.inline`, bool, default: `false`

  Only parse inline Markdown elements (such as links and emphasis, unlike lists and fenced code blocks)

### Response

* `metadata.disableToc`, bool

  Whether or not the input Markdown did **not** contain headings (`#`, `##`, …). This property is named that way because we use it to disable Table of Contents generation when no headings were found.
  `disableToc: true` means *no headings*
  `disableToc: false` means at least one *heading*

* `metadata.ping`, string[], undefined if `opts.disable_ping: true`

  The list of nicknames returned by `remark-ping`. Can be used to send "ping" notifications to the corresponding users.
  Note: this is fully customizable, `remark-ping` can validate potential *ping*s by any means, including sending an HTTP request (we recommend `HEAD`) to a REST API to make sure this username actually exists.

* `metadata.languages`, string[]

  A list of unique languages used in GitHub Flavoured Markdown fences with a flag.

## `/latex` - Markdown to LaTeX

### Request

* `opts.disable_images_download`, bool, default: `false`

  Do not download images.

* `opts.images_download_dir`, string

  Where to download the images to.

* `opts.local_url_to_local_path`, \[from: string, to: string\], default: `<none>`

  If provided, local images referenced in Markdown source (such
  as `![](/img/example.png)`) will be copied to `images_download_dir`
  after replacing the string `from` with `to` using the following RegExp:

  ```js
  '/img/example.png'.replace(new RegExp(`^${from}`), to)
  ```

* `opts.disable_jsfiddle`: see `/html`

### Response


* `[contents, metadata, messages]`

  This endpoint only returns `{}` as metadata, i.e. an empty object.

## `/latex-document` - Markdown to tex file

### Request


* `opts.disable_images_download`: see `/latex`
* `opts.images_download_dir`: see `/latex`
* `opts.local_url_to_local_path`: see `/latex`
* `opts.disable_jsfiddle`: see `/html`
* `opts.content_type`, string, **required**

  Will be interpolated in `\documentclass[${content_type}]{zmdocument}`

* `opts.title`, string, **required**

  Will be interpolated in `\title{${title}}`

* `opts.authors`, string[], **required**

  Will be interpolated in `\author{${authors.join(', ')}}`

* `opts.license`, string, **required**

  E.g. `CC-BY-SA` will be displayed as-is, using `${license_directory}/by-sa.svg` as license icon with a link to `https://creativecommons.org/licenses/by-sa/4.0/legalcode`

* `opts.license_directory`, string, **required**

  Path to the directory where CC license SVG icons are stored, see `license` above.

* `opts.smileys_directory`, string, **required**

  Path to the directory where smileys are stored.

### Response

* `[contents, metadata, messages]`

  This endpoint only returns `{}` as metadata, i.e. an empty object.

## Client Architecture

The architecture of the client is similar to `remark` or `Vue`. The *manager*, here `client/client.js`, exposes a global variable `ZMarkdown`. This *manager* doesn't work alone because it does not know how to convert the input to the desired output. Example, if you want to convert markdown to html, the *manager* doesn't know how to do this. It need modules to know how to do this.

### Manager

You need to add modules with `ZMarkdown.use(obj)` to manage rendering.

To convert a markdown string you should use `ZMarkdown.render(str, moduleName = defaultModule, cb = undefined)`:
- **str**: `string`, string to convert
- **moduleName**: `string`, name of the module you want to use. This parameter can be **omitted only** if you define a default module with `ZMarkdown.setDefaultModule` (you can reset default module with `ZMarkdown.resetDefaultModule`)
- **cb**: `function(err, vfile)`, called when process is done

This function returns a `Promise` if no callback specified.

`ZMarkdown` also has a `parse(moduleName)` function to get the MDAST tree and `getParser(moduleName)` to get the whole parser. This parameter can be **omitted only** if you define a default module with `ZMarkdown.setDefaultModule`.

### Module

A module is an object with the following properties:

- **name**: `string`, module name used to identify each module.
- **render**: `function(input, cb): void`, a function called by `ZMarkdown.render`. It returns a `Promise` if no callback specified.
- **parse**: `function(input): object`, gets MDAST tree.
- **getParser**: `function(): object`, gets the whole of parser.
- **initialize**: `function(config)`, configure the module with a custom configuration. You do not have to call this function if you want to use the default configuration.

### Tips

You can start a module with a base parser using `./common.js` (see `./modules/zhtml.js` for instance). The module exports a function that can take two optionals parameters:
- **opts**: an object that can have:
  - **remarkConfig**: `object`, your remark config (defaults to the configuration from `config/remark.js`).
  - **extraRemarkPlugins**: `Array<objects>`, remark plugins you want to add to the default parser (remark pipeline). The object should contain:
    - **obj**: `remark plugin`.
    - **option**: optional, plugin config.
- **processor**: `function(config)` (defaults to `getHTMLProcessor` of `./common.js`), processor function used to configure the remark pipeline for your output

### Module Example

```js
const common = require('zmarkdown/modules/common') /* zmarkdown common file */
const remarkToc = require('remark-toc')
const remark2rehype = require('remark-rehype')

const opts = {
  remarkConfig: undefined /* custom remark config, defaults to ./config/remark.js */,
  extraRemarkPlugins: [
    {
      obj: remarkToc,
      option: undefined /* remark plugin option, undefined or omit to not configure it */
    },
    …
  ],
}

const processor = (config) => {
  config.remarkConfig.noTypography = true

  return globalParser.zmdParser(config.remarkConfig, config.extraRemarkPlugins)
    .use(remark2rehype, config.remarkConfig.remark2rehype)
}

const globalParser = common(opts, processor)

export function render (input, cb) {
  return globalParser.render(input, cb)
}

export function parse (input) {
  return parser.parse(input)
}

export function getParser () {
  return parser
}

export const name = 'custom-html'
```

Modules need to be bundled, here is a webpack config for the previous example:

```js
const path = require('path')

const mode = process.env.NODE_ENV ? process.env.NODE_ENV : 'production'

module.exports = {
    mode,
    name: 'ZMarkdownCustomHTML', // name of process if you use parallel-webpack
    entry: ['./modules/custom-html'], // path to your module
    output: {
      path: path.resolve(__dirname, 'dist'), // destination folder
      filename: 'custom-html.js', // file name
      library: 'ZMarkdownCustomHTML', // Name of the object that will be available on the `window` global object
    },
    module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: 'babel-loader',
            },
          },
        ],
    },
}
```

### Dev build

If you want to watch the local files while working zmarkdown, you can use `npm run watch:client`. Run the client by opening `./public/index.html`.

*Note: the current implementation (parallel-webpack) doesn't support hot-reload, you will have to manually refresh the webpage after each change*.

### Production build

To build for production, just run `npm run release`. Generated files are located in `./dist`.

[ping]: https://www.npmjs.com/package/remark-ping
[iframes]: https://www.npmjs.com/package/remark-iframes
