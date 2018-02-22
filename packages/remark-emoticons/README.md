# remark-emoticons [![Build Status][build-badge]][build-status] [![Coverage Status][coverage-badge]][coverage-status]

This [remark][remark] plugin parses ASCII emoticons such as `:D` or shortcodes such as `:smiling-cat:`. It can be configured to parse any shortcode/emoticon you wish.

It introduces a new [MDAST][mdast] node type: "emoticon".

This plugin is compatible with [rehype][rehype], turning the emoticons or shortcodes into HTML `<img>` tags with customizable classes.

## Syntax

```markdown
:D
```

will yield an element of type:

```javascript
interface emoticon <: Node {
  type: "emoticon";
  value: string;
  data: {
    hName: "img";
    hProperties: {
      src: string;
      alt: string;
      className: string;
    }
  }
}
```

if you configured the plugin with :

```javascript
{
  emoticons: {
    ':D': '/static/smileys/happy.png',
  },
  classes: 'some-smiley foo',
}
```

the produced AST node will contain :

```javascript
{
  type: "emoticon",
  value: ":D",
  data: {
    hName: "img";
    hProperties: {
      src: '/static/smileys/happy.png';
      alt: ":D";
      className: "some-smiley foo";
    }
  }
}
```

If you use [rehype][rehype] stringifier it will output :

```html
<img src="/static/smileys/happy.png" alt=":D" class="some-smiley foo">
```

## Installation

[npm][npm]:

```bash
npm install remark-emoticons
```

## Usage

Dependencies:

```javascript
const unified = require('unified')
const remarkParse = require('remark-parse')
const stringify = require('rehype-stringify')
const remark2rehype = require('remark-rehype')

const remarkEmoticons = require('remark-emoticons')
```

Usage:

```javascript
unified()
  .use(remarkParse)
  .use(remarkEmoticons, {
   emoticons: {
     ':D': '/static/smileys/happy.png',
   },
   classes: 'some-class'
  })
  .use(remark2rehype)
  .use(stringify)
```

## License

[MIT][license] © [Zeste de Savoir][zds]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/zestedesavoir/zmarkdown.svg

[build-status]: https://travis-ci.org/zestedesavoir/zmarkdown

[coverage-badge]: https://img.shields.io/coveralls/zestedesavoir/zmarkdown.svg

[coverage-status]: https://coveralls.io/github/zestedesavoir/zmarkdown

[license]: https://github.com/zestedesavoir/zmarkdown/blob/master/packages/remark-emoticons/LICENSE-MIT

[zds]: https://zestedesavoir.com

[npm]: https://www.npmjs.com/package/remark-emoticons

[mdast]: https://github.com/syntax-tree/mdast/blob/master/readme.md

[remark]: https://github.com/wooorm/remark

[rehype]: https://github.com/wooorm/rehype
