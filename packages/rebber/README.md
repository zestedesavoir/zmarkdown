# Presentation

TODO

# Type configuration

Every node type transformation to LaTeX can be customized thanks to the plugin configuration.

Basically you have to give your custom function to translate the node and its content.

Most of *macro* functions have this prototype : `(innerText) => str`

Exceptions are :

- `link.macro` : its prototype is `(displayedText, url, title) => str`, another parameter exists to autoprepend a customized domain to the url
for example, with `link.prefix = 'https://zestedesavoir.com'` every url starting with `/` will become `http://zestedesavoir.com{url}`.
- `table` : as table is a complex one, the macro takes `(ctx, node) => str` where `ctx` are the rebber options and `node` the current mdast node
- `list` : gets a second boolean argument wich defines if the list is ordered

Before rendering, we use a bunch of preparsers --actually MDAST visitors-- to ensure a latex-complient tree.

# Configure image download

LateX doesn't support remote images. But `rebber` can download images in a customizable folder to generate a pdf with downloaded images. To enable this option, you can configure `rebber` like this:

```js
const {contents} = unified()
  .use(reParse)
  .use(rebber, {
    downloadImage: true,
    destination: downloadDirectory,
    maxlength: 1000000,
  })
  .processSync(yourMD)
```

where `downloadImage` is if rebber download images, `destination` is the destination path for downloaded images (`./` by default) and `maxlength` is the limit of a file (no limit by default).
