# remark-images-download [![Build Status][build-badge]][build-status] [![Coverage Status][coverage-badge]][coverage-status]

This plugin download images in a custom directory (and change the image url to the downloaded file).

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
  })
  .use(remark2rehype)
  .use(stringify)
```

## Configuration fields:

- `disabled`: enable the plugin.
- `downloadDestination`: where downloads should be stored (must exists).
- `maxFileLength`: if a file is larger than this number (in bytes), the plugin will not download it.
- `dirSizeLimit`: the directory size limit.

## example

```markdown
Two small images:
![](https://example.com/example.png)
![](https://example.com/example2.png)

And a image of 1Tb!
![](https://example.com/example_1Tb.png)
```

with the previous configuration `remark-images-download` will download the two first images in `img/UUID/otherUUID.png` and `img/UUID/yetAnotherUUID.png` where `UUID` is a random string and it does not download `example_1Tb.png` because the file is too large.


## License

[MIT][license] © [Zeste de Savoir][zds]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/zestedesavoir/zmarkdown.svg

[build-status]: https://travis-ci.org/zestedesavoir/zmarkdown

[coverage-badge]: https://img.shields.io/coveralls/zestedesavoir/zmarkdown.svg

[coverage-status]: https://coveralls.io/github/zestedesavoir/zmarkdown

[license]: https://github.com/zestedesavoir/zmarkdown/blob/master/packages/remark-images-download/LICENSE-MIT

[zds]: https://zestedesavoir.com

[npm]: https://www.npmjs.com/package/remark-align

[mdast]: https://github.com/syntax-tree/mdast/blob/master/readme.md

[remark]: https://github.com/wooorm/remark

[rehype]: https://github.com/wooorm/rehype
