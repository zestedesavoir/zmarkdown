# zmarkdown server HTTP API

### Usage

* See `npm run server`
* `pm2 monit` etc

### Requests
All endpoints respond to `HTTP POST` requests with these keys in their body:

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

## `/latex` - Markdown to LaTeX

### Request

* `opts.disable_images_download`, bool, default: `false`

  Does not download the images.

* `opts.images_download_dir`, bool, default: `false`

  Where to download the images to.

* `opts.disable_jsfiddle`, bool, default: `false`

  see `/html`

### Response


* `[contents, metadata, messages]`

  This endpoint only returns `{}` as metadata, i.e. an empty object.

## `/latex-document` - Markdown to tex file

### Request


* `opts.disable_images_download`, bool, default: `false`

  see `/latex`

* `opts.images_download_dir`, bool, default: `false`

  see `/latex`

* `opts.disable_jsfiddle`, bool, default: `false`

  see `/html`

* `opts.contentType`, string

  Will be interpolated in `\documentclass[${contentType}]{zmdocument}`

* `opts.title`, string

  Will be interpolated in `\title{${title}}`

* `opts.authors`, string[]

  Will be interpolated in `\author{${authors.join(', ')}}`

* `opts.license`, string

  E.g. `CC-BY-SA` will be displayed as-is, using `${licenseDirectory}/by-sa.svg` as license icon with a link to `https://creativecommons.org/licenses/by-sa/4.0/legalcode`

* `opts.licenseDirectory`, string

  Path to the directory where CC license SVG icons are stored, see `license` above.

* `opts.smileysDirectory`, string

  Path to the directory where smileys are stored.

### Response

* `[contents, metadata, messages]`

  This endpoint only returns `{}` as metadata, i.e. an empty object.



[ping]: https://www.npmjs.com/package/remark-ping
[iframes]: https://www.npmjs.com/package/remark-iframes
