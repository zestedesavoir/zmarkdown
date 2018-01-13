# zmarkdown server HTTP API

### Request
All endpoints respond to `HTTP POST` requests with these keys in their body:

* `md` - required, markdown source string
* `opts` - optional, JSON options

`md` being a boring Markdown string, only `opts` will be specified below.

### Response

All endpoints return `[contents, metadata]` as JSON.

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

## `/latex` - Markdown to latex

### Request

* `opts.disable_jsfiddle`, bool, default: `false`
  see `/html`

### Response

## `/latex-document` - Markdown to tex file

### Request

* `opts.disable_jsfiddle`, bool, default: `false`
  see `/html`
* `opts.svg_dest`, string, default: <none> (SVGs won't get saved to file)
  Absolute path to the directory where Mairmaid's SVGs will be stored.

### Response

* [ping]: https://www.npmjs.com/package/remark-ping
* [iframes]: https://www.npmjs.com/package/remark-iframes
