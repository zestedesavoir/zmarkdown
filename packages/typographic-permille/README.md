# typographic-permille [![Build Status][build-badge]][build-status] [![Coverage Status][coverage-badge]][coverage-status]

Micro module to replace `%o` with `‰` and optionally replace the preceding space.

This is meant for typography, where %o should be replaced by a per mille sign ([en](http://www.fileformat.info/info/unicode/char/2030/index.htm), [fr](https://fr.wikipedia.org/wiki/Pour_mille)).
This is mainly meant for French typography, it replaces the space preceding a per mille sign by a _narrow no-break space_ ([en](http://www.fileformat.info/info/unicode/char/202f/index.htm), [fr](https://fr.wikipedia.org/wiki/Espace_fine_ins%C3%A9cable)).

Submit a PR to `src/db.js` to add support for your locale.

## Install

[npm][npm]:

```sh
npm install --save typographic-permille
```


## Usage

```js
var permille = require('typographic-permille')

permille(`Top 1%o.`, { locale: 'en' }) // Top 1‰

permille(`Top 1 %o.`, { locale: 'fr' }) // Top 1 ‰
// this char   ^ will be replaced by a narrow no-break space
```

This module can also be used through [textr][textr].

## License

[MIT][license] © [Zeste de Savoir][zds]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/zestedesavoir/zmarkdown.svg

[build-status]: https://travis-ci.org/zestedesavoir/zmarkdown

[coverage-badge]: https://img.shields.io/coveralls/zestedesavoir/zmarkdown.svg

[coverage-status]: https://coveralls.io/github/zestedesavoir/zmarkdown

[license]: https://github.com/zestedesavoir/zmarkdown/blob/master/packages/typographic-permille/LICENSE-MIT

[zds]: https://zestedesavoir.com

[npm]: https://www.npmjs.com/package/typographic-permille

[textr]: https://github.com/A/textr
