# rebber [![Build Status][build-badge]][build-status] [![Coverage Status][coverage-badge]][coverage-status]


**rebber** is a LaTeX stringifier for [remark][]

## remark-rebber version compatibility

Starting from version 8.0.0, `remark` dropped support for footnotes; hence, `rebber` also dropped it's support starting from version 6.0.0.

Therefore, we have the following compatibility table for remark-rebber versions:

| remark  | rebber  |
| ------- | ------- |
| < 8.0.0 | < 6.0.0 |
| > 8.0.0 |   any   |

## Installation

[npm][]:

```bash
npm install rebber
```

## Usage

```javascript
const unified = require('unified')
const remarkParser = require('remark-parse')
const rebber = require('rebber')

const {contents} = unified()
  .use(remarkParser)
  .use(rebber)
  .processSync('### foo')

console.log(contents);
```

Yields:

```latex
\section{foo}
```

## API

### `toLaTeX(node[, options])`

Stringify the given [MDAST node][mdast].


#### `options.overrides`

Overrides are named that way because they can override any MDAST node type to latex stringifier. Their other use is to use custom latex stringifier for custom MDAST node type.

Examples:

```js
const {contents} = unified()
  .use(remarkParser)
  .use(remarkFoobarElementsParser) // creates MDAST nodes of type 'foobar'
  .use(rebber, {
    overrides: {
      // override rebber's method to turn MDAST link nodes into latex
      link: require('./your-own-link-latexifier')
      // tell rebber what to use to turn MDAST foobar nodes into latex
      foobar: require('./your-foobar-latexifier')
    }
  })

```

#### `options.<mdastNodeType>`

[MDAST nodes][mdast] are stringified to LaTeX using sensible default LaTeX commands. However, you can customize most of the LaTeX command corresponding to MDAST nodes. Here are documented the function signatures of these customizable commands. Note that the keys of the `options` object are named after the corresponding MDAST node type.

For example, by default, `![](/foo.png)` will get compiled to `\includegraphics{/foo.png}`.

Setting
```js
options.image = (node) => `[inserted image located at "${node.url}"]`
```

will stringify our example Markdown to `[inserted image located at "/foo.png"]` instead of `\includegraphics{/foo.png}`.

###### `options.blockquote`

    (text) => ``,

###### `options.break`

    () => ``,

###### `options.code`

    (textCode, lang) => ``,

###### `options.definition`

    (options, identifier, url, title) => ``,

###### `options.footnote`

    (identifier, text, protect) => ``,

###### `options.footnoteDefinition`

    (identifier, text) => ``,

###### `options.footnoteReference`

    (identifier) => ``,

###### `options.headings`

    [
      (text) => ``, // level 1 heading
      (text) => ``, // level 2 heading
      (text) => ``, // level 3 heading
      (text) => ``, // level 4 heading
      (text) => ``, // level 5 heading
      (text) => ``, // level 6 heading
      (text) => ``, // level 7 heading
    ],

###### `options.image`

    (node) => ``,

###### `options.link`

    (displayText, url, title) => ``,

###### `options.linkReference`

    (reference, content) => ``,

###### `options.list`

    (content, isOrdered) => ``,

###### `options.listItem`

    (content) => ``,

###### `options.text`

    (text) => ``,

###### `options.thematicBreak`

    () => ``,

###### `options.table`

    (ctx, node) => ``,

To ensure a flexible rendering, `longtabu` environment is used by default.
Table stringification can be configured with some advanced options:

###### `options.spreadCell`

` spread 0pt `

Customize cells spacing (usually done using the `spread` command).
Common commands are ` spread <dimension> ` (add `<dimension>` as spacing ) or ` to <dimension> ` (fix the overall width of table).
Default value is ` spread 0pt ` (natural spacing).

###### `options.firstLineRowFont`

`'\\rowfont[c]{\\bfseries}'`

Customize the first line font (this is useful when your tables always have a header as first line).
Default value is `'\\rowfont[c]{\\bfseries}'` (bold, center aligned).

###### `options.defaultOtherLineRowFont`

`'\\rowfont[l]{}'`

Customize table font for all lines except the first.
Default value is `'\\rowfont[l]{}'` (normal font, left aligned).

###### `options.headerParse: (tableRows) => ''`

    (tableRows) => ''

Cunction that computes the "latex header" part of the table environment, this generates strings such as `|c|c|r|`.
It gets an array of all the `tableRow` [mdast] nodes for the table as argument.
Default function extracts the number of columns for each row and uses the `X[-1]` handler ("find the best available width").
The result for a 3 column-table is `|X[-1]|X[-1]|X[-1]|`.


## Related

*   [`rebber-plugins`][rebber-plugins]
    - A collection of rebber plugins able to stringify custom Remark node types.

## License

[MIT][license] © [Zeste de Savoir][zds]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/zestedesavoir/zmarkdown.svg

[build-status]: https://travis-ci.org/zestedesavoir/zmarkdown

[coverage-badge]: https://img.shields.io/coveralls/zestedesavoir/zmarkdown.svg

[coverage-status]: https://coveralls.io/github/zestedesavoir/zmarkdown

[license]: https://github.com/zestedesavoir/zmarkdown/blob/master/packages/rebber/LICENSE-MIT

[rebber-plugins]: https://github.com/zestedesavoir/zmarkdown/blob/master/packages/rebber-plugins

[zds]: https://zestedesavoir.com

[npm]: https://www.npmjs.com/package/rebber

[mdast]: https://github.com/syntax-tree/mdast/blob/master/readme.md

[remark]: https://github.com/remarkjs/remark
