# remark-ping [![Build Status][build-badge]][build-status] [![Coverage Status][coverage-badge]][coverage-status]

This plugin parses custom Markdown syntax such as `@someone` or `@**nick with spaces**` to create links such as `/member/profile/someone` to the corresponding user page if this user exists in your system.

## Default Syntax

```markdown
@username
@**nick with spaces**
```

## AST (see [mdast][mdast] specification)

`Ping` ([`Parent`][parent]) represents a reference to a user.

```javascript
interface Ping <: Parent {
  type: "ping";
  url: "member profile url";
  username: "username";
}
```

## rehype

This plugin is compatible with [rehype][rehype]. `Ping` mdast nodes will become HTML links pointing to a customizable target, usually used to link to a user profile.

```md
@foo
```

gives:

```html
<a href="/custom/link/foo/" rel="nofollow" class="ping ping-link">
  @<span class="ping-username">foo</span>
</a>
```

Pings are handled a bit differently if they are already inside of a link:

```md
[@foo](http://example.com)
```

gives:

```html
<a href="http://example.com">
  <span class="ping ping-in-link">
    @<span class="ping-username">foo</span>
  </span>
</a>
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
      userURL: (username) => `https://your.website.com/path/to/${username}`
  })
  .use(remark2rehype)
  .use(stringify)
```

as you can see, `remark-ping` takes two mandatory options :

- `pingUsername` is a function taking `username` as parameter and returning `true` if the user exists or should be pinged
    - If you want to parse any username without checking whether they exist or (like GitHub does), use a function always returning `true` (`() => true`)
    - When `pingUsername(username)` doesn't return `true`, the ping syntax is simply ignored and no AST `Ping` node gets created for this username
- `userUrl` is a function taking `username` as parameter and returning a path or URL to this user profile or member page

You can override the default parsing regexp, for example if you don't want to include `@**username with space**` by setting up the `usernameRegex` option:

```js
  .use(remarkPing, {
      pingUsername: (username) => true,
      userURL: (username) => `https://your.website.com/path/to/${username}`,
      usernameRegex: /[\s'"(,:<]?@(\w+)/,
  })
```

### Retrieving the usernames to ping

Once the Markdown has been processed by this plugin, the output `vfile` contains a `ping` array in the `data` property.

This array contains every username that should be ping, should you want your backend to generate notifications for these.

```js
unified()
  .use(reParse)
  .use(plugin, {pingUsername, userURL})
  .use(remark2rehype)
  .use(rehypeStringify)
  .process('@foo @bar')
  .then((vfile) => {
    console.log(vfile.data.ping.length === 2) // true
    console.log(vfile.data.ping[0] === 'foo') // true
    console.log(vfile.data.ping[1] === 'bar') // true
    return vfile
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

[rehype]: https://github.com/wooorm/rehype

[parent]: https://github.com/syntax-tree/unist#parent
