# typographic-guillemets [![Build Status][build-badge]][build-status] [![Coverage Status][coverage-badge]][coverage-status]

Micro module to fix a common typographic issue that is hard to fix with most keyboard layouts.

This is mainly meant for French typography, where respectively << and >> should be replaced by a _left-pointing double angle quotation mark_ ([en](http://www.fileformat.info/info/unicode/char/00AB/index.htm), [en](https://en.wikipedia.org/wiki/Guillemet)) and a _right-pointing double angle quotation mark_([en](www.fileformat.info/info/unicode/char/00BB/index.htm)).
The left-pointing mark should be followed by a _narrow no-break space_ ([en](http://www.fileformat.info/info/unicode/char/202f/index.htm), [fr](https://fr.wikipedia.org/wiki/Espace_fine_ins%C3%A9cable)) and the right-pointing mark should be preceded by a _narrow no-break space_.

Submit a PR to `src/db.js` to add support for your locale.

## Install

[npm][npm]:

```sh
npm install --save typographic-guillemets
```


## Usage

```js
var guillemets = require('typographic-guillemets')

guillemets(`<< here >>`, { locale: 'fr' })
// will be replaced by «NNBShereNNBS» where NNBS is a narrow no-break space.
```

This module can also be used through [textr][textr].

## License

[MIT][license] © [Zeste de Savoir][zds]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/zestedesavoir/zmarkdown.svg

[build-status]: https://travis-ci.org/zestedesavoir/zmarkdown

[coverage-badge]: https://img.shields.io/coveralls/zestedesavoir/zmarkdown.svg

[coverage-status]: https://coveralls.io/github/zestedesavoir/zmarkdown

[license]: https://github.com/zestedesavoir/zmarkdown/blob/master/packages/typographic-guillemets/LICENSE-MIT

[zds]: https://zestedesavoir.com

[npm]: https://www.npmjs.com/package/typographic-guillemets

[textr]: https://github.com/A/textr
