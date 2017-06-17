# typographic-em-dash [![Build Status][build-badge]][build-status] [![Coverage Status][coverage-badge]][coverage-status]

Micro module to fix a common typographic issue that is hard to fix with most keyboard layouts.

This is mainly meant for French typography, it replaces _--_ by an _em dash_ ([en](http://www.fileformat.info/info/unicode/char/2014/index.htm), [fr](https://fr.wikipedia.org/wiki/Cadratin)). If the locale is French and we have a pair like _— foo —_, the first space after the first em dash and the space preceding the second dash will be a _narrow no-break space_ ([en](http://www.fileformat.info/info/unicode/char/202f/index.htm), [fr](https://fr.wikipedia.org/wiki/Espace_fine_ins%C3%A9cable)).

Submit a PR to `src/db.js` to add support for your locale.

## Install

[npm][npm]:

```sh
npm install --save typographic-em-dash
```


## Usage

```js
var dash = require('typographic-em-dash')

dash(`--foo--`, { locale: 'fr' })
// will be replaced by —foo—
dash(`-- foo --`, { locale: 'fr' })
// will be replaced by —NNBSfooNNBs— where NNBS is a narrow no-break space
dash(`--foo--`, { locale: 'en' })
// will be replaced by —foo—
dash(`-- foo --`, { locale: 'en' })
// will be replaced by — foo —
```

This module can also be used through [textr][textr].

## License

[MIT][license] © [Zeste de Savoir][zds]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/zestedesavoir/zmarkdown.svg

[build-status]: https://travis-ci.org/zestedesavoir/zmarkdown

[coverage-badge]: https://img.shields.io/coveralls/zestedesavoir/zmarkdown.svg

[coverage-status]: https://coveralls.io/github/zestedesavoir/zmarkdown

[license]: https://github.com/zestedesavoir/zmarkdown/blob/master/packages/typographic-em-dash/LICENSE-MIT

[zds]: https://zestedesavoir.com

[npm]: https://www.npmjs.com/package/typographic-em-dash

[textr]: https://github.com/A/text
