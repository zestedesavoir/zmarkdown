# Presentation

TODO

# Type configuration

Every node type transformation to LaTeX can be customized thanks to the plugin configuration.

Basically you have to give your custom function to translate the node and its content.

Most of *macro* functions have this prototype : `(innerText) => str`

Exceptions are :

- `link.macro` : its prototype is `(displayedText, url, title) => str`, another parameter exists to autoprepend a customized domain to the url
for example, with `link.prefix = 'https://zestedesavoir.com'` every url starting with `/` will become `http://zestedesavoir.com{url}`.
- `table` : as table is a complex one, the macro takes `(ctx, node) => str` where `ctx` are the rebber options and `node` the current mdast node
- `list` : gets a second boolean argument wich defines if the list is ordered

Before rendering, we use a bunch of preparsers --actually MDAST visitors-- to ensure a latex-complient tree.
