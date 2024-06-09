# remark-iframes

This plugin parses custom Markdown syntax to create iframes.
It adds a new node type to the [mdast][mdast] produced by [remark][remark]: `iframe`.

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
      loading: string?;
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
    providers: [
      {
        hostname: ['youtube.com', 'www.youtube.com', 'youtu.be'],
        width: 560,
        height: 315,
        disabled: false,
        oembed: 'https://www.youtube.com/oembed'
      },
      {
        hostname: ['jsfiddle.net', 'www.jsfiddle.net'],
        width: 560,
        height: 560,
        disabled: false,
        match: /https?:\/\/(www\.)?jsfiddle\.net\/([\w\d]+\/[\w\d]+\/\d+\/?|[\w\d]+\/\d+\/?|[\w\d]+\/?)$/,
        transformer: embedLink => `${embedLink.replace('http://', 'https://')}embedded/result,js,html,css/`
      }
    ]
  })
  .use(remark2rehype)
  .use(stringify)
```

## Configuration

This plugin can take the `providers` option, which contains a list of providers allowed for iframes. Any of the given providers object can have the following fields:

- `hostname`: a hostname or list of hostnames matched;
- `width` and `height`: iframe size, set as `width="" height=""` HTML attributes. If `oembed` is used (see below), these parameters overwrite the oEmbed response;
- `disabled`: can be used to disable this provider. This is useful when you want to deal with multiple configurations from a common set of plugins;
- `lazyLoad`: tell browsers to lazy load the iframe whenever possible, using the HTML `loading` attribute.

Furthermore, one of the two possible ways to generate an embed URL should be configured: either an oEmbed provider or a manual transformer.

### oEmbed usage

Use the following parameter:

- `oembed`: an URL to the oEmbed API of the website you want to embed.

The thumbnail will be constructed automatically from the oEmbed `thumbnail_url` response, and both `width` and `height` will be extracted from the answer, unless overridden by configuration.

### Transformer usage

Use the following parameters:

- `match`: regular expression passed to `String.prototype.test`, used to validate the URL;
- `transform`: function used to transform the Markdown URL in order to make the iframe `src` URL;
- `thumbnail`: function used to retrieve a thumbnail. This param is either a (constant) string or a function that takes the final URL as a parameter.

## Example

### Config

```javascript
{
  providers: [
    {
      hostname: ['youtube.com', 'www.youtube.com', 'youtu.be'],
      width: 560,
      height: 315,
      disabled: false,
      oembed: 'https://www.youtube.com/oembed'
    },
    {
      hostname: ['jsfiddle.net', 'www.jsfiddle.net'],
      width: 560,
      height: 560,
      disabled: false,
      match: /https?:\/\/(www\.)?jsfiddle\.net\/([\w\d]+\/[\w\d]+\/\d+\/?|[\w\d]+\/\d+\/?|[\w\d]+\/?)$/,
      transformer: embedLink => `${embedLink.replace('http://', 'https://')}embedded/result,js,html,css/`
    }
  ]
}
```

### Input

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
          src: 'https://www.youtube.com/embed/8TQIvdFl4aU?feature=oembed',
          width: 560,
          height: 315,
          allowfullscreen: true,
          frameborder: '0'
        }
        thumbnail: 'https://i.ytimg.com/vi/8TQIvdFl4aU/hqdefault.jpg'
      }
}
```

### Resulting HTML

```html
<iframe src="https://www.youtube.com/embed/8TQIvdFl4aU?feature=oembed" width="560" height="315"></iframe>
```

## License

[MIT][license] © [Zeste de Savoir][zds]

<!-- Definitions -->

[license]: https://github.com/zestedesavoir/zmarkdown/blob/master/packages/remark-iframes/LICENSE-MIT

[zds]: https://zestedesavoir.com

[npm]: https://www.npmjs.com/package/remark-iframes

[remark]: https://github.com/remarkjs/remark 

[rehype]: https://github.com/rehypejs/rehype

[mdast]: https://github.com/syntax-tree/mdast
