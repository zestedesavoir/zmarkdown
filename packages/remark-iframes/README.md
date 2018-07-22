# remark-iframes [![Build Status][build-badge]][build-status] [![Coverage Status][coverage-badge]][coverage-status]

This plugin parses custom Markdown syntax to create iframes.

This creates a new MDAST element called "iframe"

If you are using [rehype][rehype], the stringified HTML result will be a tag you can configure. Most of time you want `iframe`.

## iframe node type

```javascript
interface iframe <: Node {
  type: "iframe";
  url: string;
  provider: string;
  data: {
    hName: "iframe";
    hProperties: {
      src: string;
      width: 0 <= uint32;
      height: 0 <= uint32;
      allowfullscreen: boolean;
      frameborder: string;
    }
    thumbnail: string?;
  }
}
```

`provider` variable refers to the provider as configured in plugin options.

## Syntax

```markdown
!(https://www.youtube.com/watch?v=8TQIvdFl4aU)
```

## Installation

[npm][npm]:

```bash
npm install remark-iframes
```

## Usage

Dependencies:

```javascript
const unified = require('unified')
const remarkParse = require('remark-parse')
const stringify = require('rehype-stringify')
const remark2rehype = require('remark-rehype')

const remarkIframe = require('remark-iframes')
```

Usage:

```javascript
unified()
  .use(remarkParse)
  .use(remarkIframe, {
    // this key corresponds to the hostname: !(http://hostname/foo)
    // the config associated to this hostname will apply to any iframe
    // with a matching hostname
   'www.youtube.com': {
      tag: 'iframe',
      width: 560,
      height: 315,
      disabled: false,
      replace: [
        ['watch?v=', 'embed/'],
        ['http://', 'https://'],
      ],
      thumbnail: {
        format: 'http://img.youtube.com/vi/{id}/0.jpg',
        id: '.+/(.+)$'
      },
      removeAfter: '&'
    }
  })
  .use(remark2rehype)
  .use(stringify)
```

## Configuration fields:

- `tag`: HTML tag to use in rehype output, you most probably want `iframe`.
- `width` and `height`: iframe size, set as `width="" height=""` HTML attributes.
- `disabled`: Can be used to disable this provider. This is useful when you want to deal with multiple configurations from a common set of plugins.
- `replace`: Rules passed to `String.prototype.replace` with the `input_url`. It's a list `[[from, to]]`, rules are applied sequentially on the output of the previous rule. Each rule only replaces the first occurrence.
- `removeAfter`: Truncates the URL after the first occurrence of char. For example `http://dailymotion.com/video/?time=1&bla=2` will result in `http://dailymotion.com/video/?time=1` if `removeAfter` is set to `&`.
- `append`: Any string you want to append to the URL, for example an API key.
- `removeFileName`: If set to `true`, removes the filename (i.e last fragment before query string) from URL.
- `match`: a regular expression passed to `String.prototype.test`, used to validate the URL.
- `thumbnail`: a way to retrieve a thumbnail. This param is an object with a `format` key of this type: `'http://url/{param1}/{param2}'` you must then provide patterns `param: 'pattern'` to extract the value which will replace the corresponding `{param}` in the `format` URL.
- `droppedQueryParameters`: a list of query parameters to remove from the iframe source URL.

### Thumbnail construction

when you configure the `thumbnail` as part of a provider, the URL of the thumbnail is computed following this algorithm:

```
thumbnail_url_template = provider.thumbnail.format
for each property of provider.thumbnail
  if property is not "format":
    regexp_for_current_property = provider.thumbnail[property]
    extracted_value = video_url.search(regexp_for_current_property)[1]
    thumbnail_url_template = thumbnail_url_template.replace('{' + property + '}', extracted_value)
```

## Example

### Config:

```javascript
{
   'www.youtube.com': {
      tag: 'iframe',
      width: 560,
      height: 315,
      disabled: false,
      replace: [
        ['watch?v=', 'embed/'],
        ['http://', 'https://'],
      ],
      thumbnail: {
        format: 'http://img.youtube.com/vi/{id}/0.jpg',
        id: '.+/(.+)$'
      },
      removeAfter: '&'
    }
}
```

### Input:

```markdown
!(https://www.youtube.com/watch?v=8TQIvdFl4aU)
```

### Resulting Node

```javascript
{
    type: 'iframe',
    provider: 'www.youtube.com',
    data: {
        hName: 'iframe',
        hProperties: {
          src: 'https://www.youtube.com/embed/8TQIvdFl4aU',
          width: 560,
          height: 315,
          allowfullscreen: true,
          frameborder: '0'
        }
        thumbnail: 'https://image.youtube.com/8TQIvdFl4aU/0.jpg'
      }
}
```

### Resulting HTML

```html
<iframe src="https://www.youtube.com/embed/8TQIvdFl4aU" width="560" height="315"></iframe>
```

## License

[MIT][license] © [Zeste de Savoir][zds]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/zestedesavoir/zmarkdown.svg

[build-status]: https://travis-ci.org/zestedesavoir/zmarkdown

[coverage-badge]: https://img.shields.io/coveralls/zestedesavoir/zmarkdown.svg

[coverage-status]: https://coveralls.io/github/zestedesavoir/zmarkdown

[license]: https://github.com/zestedesavoir/zmarkdown/blob/master/packages/remark-iframes/LICENSE-MIT

[zds]: https://zestedesavoir.com

[npm]: https://www.npmjs.com/package/remark-iframes

[rehype]: https://github.com/rehypejs/rehype
