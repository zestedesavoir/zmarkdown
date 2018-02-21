# remark-images-download [![Build Status][build-badge]][build-status] [![Coverage Status][coverage-badge]][coverage-status]

This plugin downloads images to a custom directory, replacing images URLs
with the path to the downloaded file.

## Installation

[npm][npm]:

```bash
npm install remark-images-download
```

## Usage

Dependencies:

```javascript
const unified = require('unified')
const remarkParse = require('remark-parse')
const stringify = require('rehype-stringify')
const remark2rehype = require('remark-rehype')

const remarkImagesDownload = require('remark-images-download')
```

Usage:

```javascript
unified()
  .use(remarkParse)
  .use(remarkIframe,
  .use(remarkImagesDownload, {
    disabled: true,
    downloadDestination: './img/',
    maxlength: 1000000,
    dirSizeLimit: 10000000,
    localUrlToLocalPath: (localUrl) => localPath
  })
  .use(remark2rehype)
  .use(stringify)
```

## Configuration options:

All options are optional.

- `disabled`: bool, default: `false`

  If `true`, disables the plugin.

- `downloadDestination`: string, default: `/tmp`

  Parent destination folder for downloads.

- `maxFileLength`: number, default: `1000000`

  Any file with a bigger size than this number (in bytes) will be skipped.

- `dirSizeLimit`: number, default: `10000000`

  Download directory size limit (in bytes). When reached, subsequent
  images are skipped.

- `localUrlToLocalPath`: `(localUrl: string): string => localPath` or `[from: string, to: string]`, default: `<none>` (skip local images)

  If provided, local images referenced in Markdown source (such
  as `![](/img/example.png)`) will be copied to `downloadDestination`
  after applying this function to the path to obtain the local location
  of `example.png`, e.g.
  `localUrlToLocalPath('/img/example.png') === '/opt/assets/example.png'`.
  It will get renamed to a shortId just like any downloaded image.

  In case a two-element array is provided, the string `from` will get
  replaced by `to` using the following RegExp:

  ```js
  '/img/example.png'.replace(new RegExp(`^${from}`), to)
  ```

  If not provided, local images will not end up in `downloadDestination`.

## example

```markdown
Two small images:
![](https://example.com/example.png)
![](https://example.com/example2.png)

And an image of 1Tb!
![](https://example.com/example_1Tb.png)
```

with the previous configuration `remark-images-download` will download the two first images in `img/UUID/otherUUID.png` and `img/UUID/yetAnotherUUID.png` where `UUID` is a random string and it does not download `example_1Tb.png` because the file is too large.

`vfile.data.imageDir` will be set to the path to the folder where images were downloaded.


## License

[MIT][license] © [Zeste de Savoir][zds]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/zestedesavoir/zmarkdown.svg

[build-status]: https://travis-ci.org/zestedesavoir/zmarkdown

[coverage-badge]: https://img.shields.io/coveralls/zestedesavoir/zmarkdown.svg

[coverage-status]: https://coveralls.io/github/zestedesavoir/zmarkdown

[license]: https://github.com/zestedesavoir/zmarkdown/blob/master/packages/remark-images-download/LICENSE-MIT

[zds]: https://zestedesavoir.com

[npm]: https://www.npmjs.com/package/remark-images-download
