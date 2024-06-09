# `micromark-extension-iframes`

**[micromark][]** extension that parses custom Markdown syntax to handle
external content frames (i.e. iframes).
This syntax extension follows a [specification][spec]; in short, the syntax is the
same as the one used for embedding images.
For instance, use `!(https://www.youtube.com/embed/{yid})` to embed a Youtube video.

This package provides the low-level modules for integrating with the micromark
tokenizer and the micromark HTML compiler. Please note that the HTML compiler is currently not very advanced. Especially, it **does not** transform the embed link in any way, nor does it add attributes to the generated `iframe` element. For more advanced options, including oEmbed integration, please see the [remark-iframe][] package.

## Install

[npm][]:

```sh
npm install micromark-extension-iframes
```

## API

### `html`

### `syntax(options?)`

> Note: `syntax` is the default export of this module, `html` is available at
> `micromark-extension-iframes/lib/html`.

Support custom syntax to handle external content frames.
The export of `syntax` is a function that can be called with options and returns
an extension for the micromark parser (to tokenize iframes; can be passed
in `extensions`).
The export of `html` is an extension for the default HTML compiler (to compile
as `<iframe>` elements; can be passed in `htmlExtensions`).

##### `options`

- `options.exclamationChar`: the character indicating the potential start of an iframe. Defaults to `!`, hence it's name.
- `options.openingChar`: the opening character for an iframe link. Defaults to `(`.
- `options.closingChar`: the closing character for an iframe link. Defaults to `)`.

## License

[MIT][license] © [Zeste de Savoir][zds]

<!-- Definitions -->

[license]: LICENCE

[micromark]: https://github.com/micromark/micromark

[npm]: https://docs.npmjs.com/cli/install

[remark-iframe]: https://www.npmjs.com/package/remark-iframes

[spec]: specs/extension.md

[zds]: https://zestedesavoir.com
