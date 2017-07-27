# remark-ping [![Build Status][build-badge]][build-status] [![Coverage Status][coverage-badge]][coverage-status]

This plugin parses custom Markdown syntax and creates links to users thanks to their username.

## Syntax

```markdown
@username
@**a username**

```
it yields a new type of AST element :

```javascript
interface Ping <: Parent {
    type: "ping";
    url: "member profile url"
    _metadata: 'username'
}
```

For example, `@username` will yield 
```javascript
{
        type: 'ping',
        _metadata: username,
        url: url,
        children: [{
          type: 'text',
          value: username
        }],
        data: {
          hName: 'a',
          hProperties: {
            href: url,
            class: 'ping'
          }
        }
      }
```


## Installation

[npm][npm]:

```bash
npm install remark-ping
```

## Usage


### Dependencies:

```javascript
const unified = require('unified')
const remarkParse = require('remark-parse')
const stringify = require('rehype-stringify')
const remark2rehype = require('remark-rehype')

const remarkPing = require('remark-ping')
```

### Usage:

```javascript
unified()
  .use(remarkParse)
  .use(remarkPing, {
      pingUsername: (username) => true,
      userURL: (username) => `http://your.website.com/path/to/${username}`
  })
  .use(remark2rehype)
  .use(stringify)
```

as you can see, `remark-ping` takes two mandatory options :

- `pingUsername` is a function taking username as parameter and returns `true` if the user is pingable, `false` otherwise. If you want to transform all `@username` to ping url, like in github, just return `true`.
- `userUrl` is a function taking username as parameter and returns the "profile" url for this username

When a user is not pingable, no AST ping element is created.

You can change the parsing regexp, for example if you don't want to include `@**username with space**` by setting up the `usernameRegex` option.

### about the `_metadata` field

This was included to add data about the element. In `zestedesavoir` application, this is the way we retrieve all the pingable users to send them notification.
We make it usable thanks to a simple visitor : 

```javascript
unified()
  .use(remarkParse)
  .use(remarkPing, {
      pingUsername: (username) => true,
      userURL: (username) => `http://your.website.com/path/to/${username}`
  })
  .use(remark2rehype)
  .use(stringify)
  .use(() => {
      return (tree, file) => {
        visit(tree, (node) => {
          if (node._metadata) {
            if (!file.data[node.type]) {
              file.data[node.type] = []
            }
            file.data[node.type].push(node._metadata)
          }
        })
      }
    })
```

## License

[MIT][license] © [Zeste de Savoir][zds]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/zestedesavoir/zmarkdown.svg

[build-status]: https://travis-ci.org/zestedesavoir/zmarkdown

[coverage-badge]: https://img.shields.io/coveralls/zestedesavoir/zmarkdown.svg

[coverage-status]: https://coveralls.io/github/zestedesavoir/zmarkdown

[license]: https://github.com/zestedesavoir/zmarkdown/blob/master/packages/remark-ping/LICENSE-MIT

[zds]: https://zestedesavoir.com

[npm]: https://www.npmjs.com/package/remark-ping

[mdast]: https://github.com/syntax-tree/mdast/blob/master/readme.md

[remark]: https://github.com/wooorm/remark

[rehype]: https://github.com/wooorm/rehype
