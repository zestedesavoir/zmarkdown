# typographic-semicolon [![Build Status][build-badge]][build-status] [![Coverage Status][coverage-badge]][coverage-status]

Micro module to fix a common typographic issue that is hard to fix with most keyboard layouts.

This is mainly meant for French typography, it replaces the space preceding a semicolon by a _narrow no-break space_ ([en](http://www.fileformat.info/info/unicode/char/202f/index.htm), [fr](https://fr.wikipedia.org/wiki/Espace_fine_ins%C3%A9cable)).

Submit a PR to `src/db.js` to add support for your locale.

## Install

[npm][npm]:

```sh
npm install --save typographic-semicolon
```


## Usage

```js
var semiColon = require('typographic-semicolon')

semiColon(`Exemple ; voici.`, { locale: 'fr' })
// this char      ^ will be replaced by a narrow no-break space
```

This module can also be used through [textr][textr].

## License

[MIT][license] © [Zeste de Savoir][zds]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/zestedesavoir/zmarkdown.svg

[build-status]: https://travis-ci.org/zestedesavoir/zmarkdown

[coverage-badge]: https://img.shields.io/coveralls/zestedesavoir/zmarkdown.svg

[coverage-status]: https://coveralls.io/github/zestedesavoir/zmarkdown

[license]: https://github.com/zestedesavoir/zmarkdown/blob/master/packages/typographic-semicolon/LICENSE-MIT

[zds]: https://zestedesavoir.com

[npm]: https://www.npmjs.com/package/typographic-semicolon

[textr]: https://github.com/A/textr
