# zmarkdown [![Build Status][build-badge]][build-status] [![Coverage Status][coverage-badge]][coverage-status]

This repository forms the basis for zmarkdown, the JavaScript project intended to replace [Python-ZMarkdown][pyzmd], the current Markdown engine powering [Zeste de Savoir][zds].

It is a collection of packages extending the [**remark**
processor][processor] and its [**MDAST**][mdast] syntax tree, [**rehype**][rehype] (for HTML processing) and [**textr**][textr] (text transformation framework).

## Install

*This project requires node >= 6.*

1. clone
2. `yarn` or `npm install`
3. `npm run test`

## License

[MIT][license] © [Zeste de Savoir][zds]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/zestedesavoir/zmarkdown.svg

[build-status]: https://travis-ci.org/zestedesavoir/zmarkdown

[coverage-badge]: https://img.shields.io/coveralls/zestedesavoir/zmarkdown.svg

[coverage-status]: https://coveralls.io/github/zestedesavoir/zmarkdown

[license]: https://github.com/zestedesavoir/zmarkdown/blob/master/LICENSE-MIT

[processor]: https://github.com/wooorm/remark/blob/master/packages/remark

[mdast]: https://github.com/wooorm/mdast

[pyzmd]: https://github.com/zestedesavoir/Python-ZMarkdown

[zds]: https://zestedesavoir.com

[rehype]: https://github.com/wooorm/rehype

[textr]: https://github.com/A/textr
