# `micromark-extension-ping`

**[micromark][]** extension that parses custom Markdown syntax to handle
user mentions, or pings.
This syntax extension follows a [specification][spec];
in short, you can ping an user with the syntax `@user`.
For usernames containing a space, use the alternative syntax `@**user space**`.

This package provides the low-level modules for integrating with the micromark
tokenizer and the micromark HTML compiler.

## Install

[npm][]:

```sh
npm install micromark-extension-ping
```

## API

### `html`

### `syntax(options?)`

> Note: `syntax` is the default export of this module, `html` is available at
> `micromark-extension-ping/lib/html`.

Support custom syntax to handle user mentions.
The export of `syntax` is a function that can be called with options and returns
an extension for the micromark parser (to tokenize user mentions; can be passed
in `extensions`).
The export of `html` is an extension for the default HTML compiler (to compile
as `<a href="/@user">` elements; can be passed in `htmlExtensions`).

##### `options`

- `options.pingChar`: the pipe character used to ping a simple user name. Defaults to `@`.
- `options.sequenceChar`: the star character added to ping user names containing a space. Defaults to `*` (star character).

## License

[MIT][license] © [Zeste de Savoir][zds]

<!-- Definitions -->

[license]: LICENCE

[micromark]: https://github.com/micromark/micromark

[npm]: https://docs.npmjs.com/cli/install

[spec]: specs/extension.md

[zds]: https://zestedesavoir.com
