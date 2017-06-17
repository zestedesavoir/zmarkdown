# zmarkdown [![Build Status][build-badge]][build-status] [![Coverage Status][coverage-badge]][coverage-status]

This repository forms the basis for zmarkdown, the JavaScript project intended to replace [Python-ZMarkdown][pyzmd], the current Markdown engine powering [Zeste de Savoir][zds].

It is a collection of packages extending the [**remark**
processor][processor] and its [**MDAST**][mdast] syntax tree, [**rehype**][rehype] (for HTML processing) and [**textr**][textr] (text transformation framework). It also provides [**MDAST**][mdast] to LaTeX compilation via [**rebber**][rebber].

## Install

### Prerequisites

* node `>=` **6**
* npm `>=` **5**

1. clone
2. `yarn`
3. `lerna run test`

## Packages

* [**rebber**][rebber]

  TODO: README

* [**rehype-abbr**][rehype-abbr]

  This plugin parses custom Markdown syntax to produce HTML abbreviations.

* [**rehype-footnotes-title**][rehype-footnotes-title]

  TODO: README

* [**rehype-html-blocks**][rehype-html-blocks]

  TODO: README

* [**remark-align**][remark-align]

  This plugin parses custom Markdown syntax to center- or right-align elements.

* [**remark-captions**][remark-captions]

  TODO: README

* [**remark-comments**][remark-comments]

  This plugin parses custom Markdown syntax for Markdown source comments.

* [**remark-custom-blocks**][remark-custom-blocks]

  This plugin parses custom Markdown syntax to create new custom blocks.

* [**remark-emoticons**][remark-emoticons]

  TODO: README

* [**remark-escape-escaped**][remark-escape-escaped]

  TODO: README

* [**remark-grid-tables**][remark-grid-tables]

  This plugin parses custom Markdown syntax to describe tables.

* [**remark-heading-shift**][remark-heading-shift]

  TODO: README

* [**remark-heading-trailing-spaces**][remark-heading-trailing-spaces]

  TODO: README

* [**remark-iframes**][remark-iframes]

  TODO: README

* [**remark-kbd**][remark-kbd]

  This plugin parses custom Markdown syntax to handle keyboard keys.

* [**remark-numbered-footnotes**][remark-numbered-footnotes]

  TODO: README

* [**remark-sub-super**][remark-sub-super]

  This plugin parses custom Markdown syntax to handle subscript and superscript.

* [**typographic-colon**][typographic-colon]

  Micro module to fix a common typographic issue that is hard to fix with most keyboard layouts.

* [**typographic-permille**][typographic-permille]

  Micro module to replace `%o` with `‰` and optionally replace the preceding space.

* [**zmarkdown**][zmarkdown]

  TODO: README



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

[rebber]: https://github.com/zestedesavoir/zmarkdown/tree/master/packages/rebber#rebber--
[rehype-abbr]: https://github.com/zestedesavoir/zmarkdown/tree/master/packages/rehype-abbr#rehype-abbr--
[rehype-footnotes-title]: https://github.com/zestedesavoir/zmarkdown/tree/master/packages/rehype-footnotes-title#rehype-footnotes-title--
[rehype-html-blocks]: https://github.com/zestedesavoir/zmarkdown/tree/master/packages/rehype-html-blocks#rehype-html-blocks--
[remark-align]: https://github.com/zestedesavoir/zmarkdown/tree/master/packages/remark-align#remark-align--
[remark-captions]: https://github.com/zestedesavoir/zmarkdown/tree/master/packages/remark-captions#remark-captions--
[remark-comments]: https://github.com/zestedesavoir/zmarkdown/tree/master/packages/remark-comments#remark-comments--
[remark-custom-blocks]: https://github.com/zestedesavoir/zmarkdown/tree/master/packages/remark-custom-blocks#remark-custom-blocks--
[remark-emoticons]: https://github.com/zestedesavoir/zmarkdown/tree/master/packages/remark-emoticons#remark-emoticons--
[remark-escape-escaped]: https://github.com/zestedesavoir/zmarkdown/tree/master/packages/remark-escape-escaped#remark-escape-escaped--
[remark-grid-tables]: https://github.com/zestedesavoir/zmarkdown/tree/master/packages/remark-grid-tables#remark-grid-tables--
[remark-heading-shift]: https://github.com/zestedesavoir/zmarkdown/tree/master/packages/remark-heading-shift#remark-heading-shift--
[remark-heading-trailing-spaces]: https://github.com/zestedesavoir/zmarkdown/tree/master/packages/remark-heading-trailing-spaces#remark-heading-trailing-spaces--
[remark-iframes]: https://github.com/zestedesavoir/zmarkdown/tree/master/packages/remark-iframes#remark-iframes--
[remark-kbd]: https://github.com/zestedesavoir/zmarkdown/tree/master/packages/remark-kbd#remark-kbd--
[remark-numbered-footnotes]: https://github.com/zestedesavoir/zmarkdown/tree/master/packages/remark-numbered-footnotes#remark-numbered-footnotes--
[remark-sub-super]: https://github.com/zestedesavoir/zmarkdown/tree/master/packages/remark-sub-super#remark-sub-super--
[typographic-colon]: https://github.com/zestedesavoir/zmarkdown/tree/master/packages/typographic-colon#typographic-colon--
[typographic-permille]: https://github.com/zestedesavoir/zmarkdown/tree/master/packages/typographic-permille#typographic-permille--
[zmarkdown]: https://github.com/zestedesavoir/zmarkdown/tree/master/packages/zmarkdown#zmarkdown--
