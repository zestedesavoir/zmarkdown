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



[ping]: https://www.npmjs.com/package/remark-ping
[iframes]: https://www.npmjs.com/package/remark-iframes
