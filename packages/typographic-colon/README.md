# typographic-colon

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Coveralls Status][coveralls-image]][coveralls-url]
[![Dependency Status][depstat-image]][depstat-url]

> [Modify spaces around a colon][rtfm]

Micro module to help eliminate one of the [bad typewriter habits][habits].


## Install

```sh
npm install --save typographic-colon
```


## Usage

Use typographic quotes for your text with respect to your locale, basically for
proper primary and secondary quotes. Pass object with specified locale field as
second parameter. **`locale` field is mandatory.** This module relies on
[`typographic-quotes-l10n-db`][quotesDB] in choosing proper quotes
for every language.


> In American English, double quotes are used normally (the “primary” style).
> If quote marks are used inside another pair of quote marks, then single quotes
> are used as the “secondary” style. For example: “Didn't she say ‘I like red
> best’ when asked her favorite wine?” he wondered to himself.
— [from the Wikipedia](http://en.wikipedia.org/wiki/Quotation_mark)

```js
var quotes = require('typographic-quotes');

// in american english (en-us) primary quotes are “”, and secondary are ‘’.
// in danish (da) primary quotes are »«, and secondary are ›‹.

// `locale` field is mandatory
quotes(`foo 'foo' bar`, { locale: 'en-us' }); // foo “foo” bar
quotes(`foo 'foo' bar`, { locale: 'da' });    // foo »foo« bar
quotes(`foo "foo 'inside' bar" bar`, { locale: 'en-us' }); // foo “foo ‘inside’ bar” bar
quotes(`foo 'foo "inside" bar' bar`, { locale: 'da' });    // foo »foo ›inside‹ bar« bar
```

[quotesDB]: https://www.npmjs.com/package/typographic-quotes-l10n-db


## Apostrophes

If you want to see proper apostrophes too, take a look at [apostrophes][typographic-apostrophes] and [apostrophes-for-possessive-plurals][typographic-apostrophes-for-possessive-plurals] typographic modules. Use first one before this module, second after: `apostrophes → quotes → apostrophes-for-possessive-plurals` (order is important). Check complex usage in [typography playground][playground].

[typographic-apostrophes]: https://www.npmjs.com/package/typographic-apostrophes
[typographic-apostrophes-for-possessive-plurals]: https://www.npmjs.com/package/typographic-apostrophes-for-possessive-plurals
[playground]: https://github.com/matmuchrapna/typographic-playground

## License

MIT © [Vladimir Starkov](https://iamstarkov.com/)

[rtfm]: http://practicaltypography.com/straight-and-curly-quotes.html
[habits]: http://practicaltypography.com/typewriter-habits.html

[npm-url]: https://npmjs.org/package/typographic-quotes
[npm-image]: http://img.shields.io/npm/v/typographic-quotes.svg

[travis-url]: https://travis-ci.org/iamstarkov/typographic-quotes
[travis-image]: http://img.shields.io/travis/iamstarkov/typographic-quotes.svg

[coveralls-url]: https://coveralls.io/r/iamstarkov/typographic-quotes
[coveralls-image]: http://img.shields.io/coveralls/iamstarkov/typographic-quotes.svg

[depstat-url]: https://david-dm.org/iamstarkov/typographic-quotes
[depstat-image]: https://david-dm.org/iamstarkov/typographic-quotes.svg
