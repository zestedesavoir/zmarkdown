# `micromark-extension-sub-super`

**[micromark][]** extension that parses custom Markdown syntax to handle
subscript and superscript.
This syntax extension follows a [specification][spec]. In a nutshell, the
syntax is very close to emphasis, but using a circumflex (`^`) character for
superscript and a tilde (`~`) character for subscript.

This package provides the low-level modules for integrating with the micromark
tokenizer and the micromark HTML compiler.

## Install

[npm][]:

```sh
npm install micromark-extension-sub-super
```

## API

### `html`

### `syntax(options?)`

> Note: `syntax` is the default export of this module, `html` is available at
> `micromark-extension-sub-super/lib/html`.

Support custom syntax to handle subscript and superscript.
The export of `syntax` is a function that can be called with options and returns
an extension for the micromark parser (to tokenize subscript and superscript;
can be passed in `extensions`).
The export of `html` is an extension for the default HTML compiler (to compile
as `<sub>` and `<sup>` elements; can be passed in `htmlExtensions`).

##### `options`

- `options.subCharCode`: the character code used for subscript. Defaults to `~`.
- `options.superCharCode`: the character code used for superscript. Defaults to `~`.

## License

[MIT][license] © [Zeste de Savoir][zds]

<!-- Definitions -->

[license]: LICENCE

[micromark]: https://github.com/micromark/micromark

[npm]: https://docs.npmjs.com/cli/install

[spec]: specs/extension.md

[zds]: https://zestedesavoir.com
